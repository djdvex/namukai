import React, {useState, useEffect, useRef} from 'react'
import { supabase } from '../App.jsx'

export default function Chat({user}){
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [remaining, setRemaining] = useState(0)

  useEffect(()=>{
    // fetch quota
    async function loadQuota(){
      const session = await supabase.auth.getSession()
      const userId = session.data?.session?.user?.id
      if(!userId) return
      const res = await fetch('/api/quota?userId='+userId)
      const data = await res.json()
      setRemaining(data.remaining || 0)
    }
    loadQuota()
  },[user])

  const send = async ()=>{
    if(!input) return
    if(remaining <= 0){ alert('Pasiekėte nemokamą limitą. Prenumeruokite planą.'); return }
    const userSession = await supabase.auth.getSession()
    const userId = userSession.data?.session?.user?.id
    const userMsg = {from:'user', text: input}
    setMessages(prev=>[...prev, userMsg])
    setInput('')

    const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({message: input, userId}) })
    const data = await res.json()
    if(data.error){ alert(data.error); return }
    setMessages(prev=>[...prev, {from:'ai', text: data.text}])
    setRemaining(data.remaining)
  }

  return (
    <div className="card chat-window">
      <div className="messages">
        {messages.map((m,i)=> (
          <div key={i} className={`message ${m.from==='user'?'user':''}`}><div>{m.text}</div></div>
        ))}
      </div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
        <div style={{color:'var(--muted)'}}>Nemokamos žinutės liko: {remaining}</div>
      </div>

      <div className="input-row">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Klausk ką nori..." />
        <button className="btn" onClick={send}>Siųsti</button>
      </div>
    </div>
  )
}
