import { useState } from 'react'
import './ExpenseForm.scss'
import { formatToYYYYMMDDTaipei } from '../utils/date'

export default function ExpenseForm({ onSubmit, initial }){
  const [name,setName]=useState(initial?.name||'')
  const [amount,setAmount]=useState(initial?.amount??'')
  const [date,setDate]=useState(initial?.date? initial.date.slice(0,10) : formatToYYYYMMDDTaipei(new Date()))
  const handle=(e)=>{
    e.preventDefault()
    if(!name.trim()) return alert('Please enter a name')
    const n = Number(amount); if(Number.isNaN(n)||n<=0) return alert('Enter a valid amount')
    onSubmit({ name, amount:n, date }); setName(''); setAmount('')
  }
  return (
    <form className="form card" onSubmit={handle}>
      <div className="row">
        <input placeholder="Expense name" value={name} onChange={e=>setName(e.target.value)}/>
        <input placeholder="Amount" type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      </div>
      <div className="actions"><button type="submit">Add</button></div>
    </form>
  )
}
