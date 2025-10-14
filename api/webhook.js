const Stripe = require('stripe');
const getRawBody = require('raw-body');
const { createClient } = require('@supabase/supabase-js');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).end();
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try{
    const buf = await getRawBody(req);
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  }catch(err){
    console.error('Webhook signature error', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try{
    const type = event.type;
    const obj = event.data.object;
    if(type === 'checkout.session.completed'){
      const session = obj;
      const userId = session.metadata?.userId;
      const stripeCustomer = session.customer;
      const subscriptionId = session.subscription;
      if(userId){
        await supabaseAdmin.from('profiles').update({ stripe_customer_id: stripeCustomer }).eq('id', userId);
      }
      if(subscriptionId && userId){
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0].price.id;
        const planName = mapPriceToPlan(priceId);
        const quota = mapPriceToQuota(priceId);
        await supabaseAdmin.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: subscriptionId,
          stripe_price_id: priceId,
          plan: planName,
          status: sub.status,
          current_period_end: new Date(sub.current_period_end * 1000)
        }, { onConflict: 'stripe_subscription_id' });
        await supabaseAdmin.from('user_quotas').upsert({ user_id: userId, remaining_messages: quota }, { onConflict: 'user_id' });
      }
    } else if(type === 'customer.subscription.updated' || type === 'customer.subscription.deleted'){
      const sub = obj;
      const subscriptionId = sub.id;
      const { data: subs } = await supabaseAdmin.from('subscriptions').select('user_id,stripe_price_id').eq('stripe_subscription_id', subscriptionId).limit(1).single();
      if(subs){
        const userId = subs.user_id;
        if(type === 'customer.subscription.deleted' || sub.status === 'canceled' || sub.status === 'unpaid'){
          await supabaseAdmin.from('subscriptions').update({ status: sub.status }).eq('stripe_subscription_id', subscriptionId);
          await supabaseAdmin.from('user_quotas').update({ remaining_messages: 20 }).eq('user_id', userId);
        }else{
          const priceId = sub.items.data[0].price.id;
          const planName = mapPriceToPlan(priceId);
          const quota = mapPriceToQuota(priceId);
          await supabaseAdmin.from('subscriptions').update({
            stripe_price_id: priceId, plan: planName, status: sub.status, current_period_end: new Date(sub.current_period_end * 1000)
          }).eq('stripe_subscription_id', subscriptionId);
          await supabaseAdmin.from('user_quotas').upsert({ user_id: userId, remaining_messages: quota }, { onConflict: 'user_id' });
        }
      }
    }
    res.json({ received: true });
  }catch(err){
    console.error('Webhook processing error', err);
    res.status(500).send('Webhook handler error');
  }
};

function mapPriceToPlan(priceId){
  const starter = process.env.VITE_STRIPE_PRICE_STARTER;
  const pro = process.env.VITE_STRIPE_PRICE_PRO;
  const premium = process.env.VITE_STRIPE_PRICE_PREMIUM;
  if(priceId === starter) return 'Starter';
  if(priceId === pro) return 'Pro';
  if(priceId === premium) return 'Premium';
  return 'Custom';
}

function mapPriceToQuota(priceId){
  const starter = process.env.VITE_STRIPE_PRICE_STARTER;
  const pro = process.env.VITE_STRIPE_PRICE_PRO;
  const premium = process.env.VITE_STRIPE_PRICE_PREMIUM;
  if(priceId === starter) return 200;
  if(priceId === pro) return 1000;
  if(priceId === premium) return 999999;
  return 100;
}
