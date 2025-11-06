import './TimeRangeSelector.scss'
export default function TimeRangeSelector({ value, onChange }){
  return (
    <div className="range">
      {['daily','weekly','monthly'].map(k=>(
        <button key={k} className={value===k?'active':''} onClick={()=>onChange(k)}>
          {k[0].toUpperCase()+k.slice(1)}
        </button>
      ))}
    </div>
  )
}
