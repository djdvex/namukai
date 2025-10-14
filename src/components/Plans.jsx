import React from 'react'
import { supabase } from '../App.jsx'

export default function Plans({user}){
  const createCheckout = async (priceId)=>{
    const userSession = await supabase.auth.getSession()
    const userId = userSession.data?.session?.user?.id
    const res = await fetch('/api/stripe-session', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({priceId, userId}) })
    const data = await res.json()
    if(data.url) window.location = data.url
    else alert('Klaida kuriant checkout')
  }

  return (
    <div className="card">
      <h4>Planai</h4>
      <div className="plans">
        <div className="plan">
          <div>Starter</div>
          <div className="price">4.99 €/mėn</div>
          <button className="btn" onClick={()=>createCheckout(import.meta.env.VITE_STRIPE_PRICE_STARTER)}>Pirkti</button>
        </div>
        <div className="plan">
          <div>Pro</div>
          <div className="price">9.99 €/mėn</div>
          <button className="btn" onClick={()=>createCheckout(import.meta.env.VITE_STRIPE_PRICE_PRO)}>Pirkti</button>
        </div>
        <div className="plan">
          <div>Premium</div>
          <div className="price">19.99 €/mėn</div>
          <button className="btn" onClick={()=>createCheckout(import.meta.env.VITE_STRIPE_PRICE_PREMIUM)}>Pirkti</button>
        </div>
      </div>
    </div>
  )
}
