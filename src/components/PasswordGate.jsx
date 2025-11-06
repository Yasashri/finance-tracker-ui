import { useEffect, useState } from 'react'
import './PasswordGate.scss'
export default function PasswordGate({ children, password }){
  const [ok,setOk]=useState(false); const [pw,setPw]=useState('')
  useEffect(()=>{ if(localStorage.getItem('exp_gate_ok')==='1') setOk(true) },[])
  const submit=(e)=>{ e.preventDefault(); if(pw===password){localStorage.setItem('exp_gate_ok','1'); setOk(true)} else alert('Wrong password') }
  if(ok) return children
  return (
    <div className="gate-wrap">
      <div className="gate card">
        <h2>Enter password to unlock</h2>
        <form onSubmit={submit}><div className="row">
          <input className="gate-input" placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)}/>
          <button type="submit">Unlock</button>
        </div></form>
        <div className="small">Hint: <b>Greatest Man Ever</b></div>
      </div>
    </div>
  )
}
