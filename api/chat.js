// api/chat.js - Vercel serverless function (Node)
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function decrementQuota(userId){
  try{
    const { data } = await supabaseAdmin
      .from('user_quotas')
      .select('remaining_messages')
      .eq('user_id', userId)
      .limit(1)
      .single();
    if(!data) {
      await supabaseAdmin.from('user_quotas').insert({ user_id: userId, remaining_messages: 20 });
      return { ok: true, remaining: 20 };
    }
    if(data.remaining_messages <= 0) return { ok: false, remaining: 0 };
    const { data: d2, error } = await supabaseAdmin.from('user_quotas')
      .update({ remaining_messages: data.remaining_messages - 1, updated_at: new Date() })
      .eq('user_id', userId)
      .select('remaining_messages')
      .single();
    if(error) return { ok:false, remaining:0 };
    return { ok:true, remaining: d2.remaining_messages };
  }catch(e){
    console.error('Quota error', e);
    return { ok:false, remaining:0 };
  }
}

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).end();
  const { message, userId } = req.body;
  if(!message || !userId) return res.status(400).json({ error: 'Missing message or userId' });

  const dec = await decrementQuota(userId);
  if(!dec.ok) return res.status(402).json({ error: 'No free messages left. Subscribe.' });

  try{
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are DI Namams — helpful Lithuanian assistant.' },
        { role: 'user', content: message }
      ],
      max_tokens: 800,
      temperature: 0.2
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    });
    const j = await r.json();
    const text = j?.choices?.[0]?.message?.content || 'Atsiprašau, klaida gavus atsakymą.';
    return res.status(200).json({ text, remaining: dec.remaining });
  }catch(e){
    console.error('OpenAI error', e);
    return res.status(500).json({ error: 'OpenAI request failed' });
  }
};
