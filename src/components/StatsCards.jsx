import './StatsCards.scss'
import { fmtMoney, parseToDate, fmtDate } from '../utils/date'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
export default function StatsCards({ daily, weekly, monthly, monthItems }){
  const chartData = monthItems.slice()
    .sort((a,b)=> parseToDate(a.date) - parseToDate(b.date))
    .map(e=>({ x: fmtDate(e.date,'MM-dd'), y: Number(e.amount) }))
  return (
    <div className="stats-grid">
      <div className="card stat"><h3>Today</h3><div style={{fontSize:28,fontWeight:900}}>{fmtMoney(daily)}</div></div>
      <div className="card stat"><h3>This Week</h3><div style={{fontSize:28,fontWeight:900}}>{fmtMoney(weekly)}</div></div>
      <div className="card stat"><h3>This Month</h3><div style={{fontSize:28,fontWeight:900}}>{fmtMoney(monthly)}</div></div>
      <div className="card" style={{gridColumn:'1 / -1',height:260}}>
        <h3 style={{marginTop:0}}>This Month Trend</h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={chartData}><XAxis dataKey="x"/><YAxis/><Tooltip/><Line type="monotone" dataKey="y" strokeWidth={2} dot={false}/></LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
