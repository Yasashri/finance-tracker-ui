import './ExpenseList.scss'
import { fmtMoney, fmtDate } from '../utils/date'
import { useEffect, useMemo, useState } from 'react'

export default function ExpenseList({ items = [], onDelete }) {
  const [page, setPage] = useState(1)
  const pageSize = 5

  // Reset to first page when the items change (search/add/remove)
  useEffect(() => setPage(1), [items])

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page])

  if (!items.length) return <div className="card">No expenses yet.</div>

  return (
    <>
      <div className="list">
        {pageItems.map((e) => (
          <div className="item" key={e.id}>
            <div>
              <div className="name">{e.name}</div>
              <div className="date">{fmtDate(e.date)}</div>
            </div>
            <div className="amount">{fmtMoney(e.amount)}</div>
            <button className="ghost" onClick={() => onDelete && onDelete(e.id)}>Delete</button>
          </div>
        ))}
      </div>

      {items.length > pageSize && (
        <div className="pagination">
          <button className="ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Newer
          </button>
          <div className="page-indicator">Page {page} / {totalPages}</div>
          <button className="ghost" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Older
          </button>
        </div>
      )}
    </>
  )
}
