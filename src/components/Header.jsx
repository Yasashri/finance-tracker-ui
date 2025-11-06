import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Header.scss'
import logo from '../assets/logo.svg'
export default function Header(){
  const [open,setOpen]=useState(false)
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand"><img src={logo} alt="logo"/>Expense Tracker</div>
        <button className="menu-btn" aria-label="Toggle menu" onClick={()=>setOpen(v=>!v)}>☰</button>
        <nav className={`nav ${open?'open':''}`} onClick={()=>setOpen(false)}>
          <Link to="/"><button className="ghost">Dashboard</button></Link>
          <Link to="/add"><button>Add Expense</button></Link>
        </nav>
      </div>
    </header>
  )
}
