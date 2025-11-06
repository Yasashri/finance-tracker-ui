import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { endOfMonth, format, isSameDay, isSameWeek, isSameMonth } from 'date-fns'
import { fetchExpenses, createExpense as apiCreate, deleteExpense as apiDelete, updateExpense as apiUpdate } from '../services/expenseApi'
import { apiReachable } from '../services/apiClient'

const ExpenseContext = createContext(null)
const STORAGE_KEY = 'expenses_v1'

export function ExpenseProvider({ children }){
  const [expenses,setExpenses] = useState([])
  const [useServer,setUseServer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{ (async()=>{
    try {
      setIsLoading(true)
      setError(null)
      const ok = await apiReachable()
      setUseServer(ok)
      if(ok){
        const list = await fetchExpenses()
        setExpenses(list)
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          if(raw) setExpenses(JSON.parse(raw))
        } catch(e){ 
          console.error('Failed to parse expenses', e)
          setError('Failed to load local expenses')
        }
      }
    } catch (e) {
      console.error('Failed to initialize expenses', e)
      setError('Failed to connect to server')
      setUseServer(false)
    } finally {
      setIsLoading(false)
    }
  })() }, [])

  useEffect(()=>{ if(!useServer) localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)) }, [expenses, useServer])

  // Helper to parse date strings from API/local storage into a local Date object.
  // Handles formats like 'YYYY-MM-DD', 'YYYY-MM-DD HH:MM:SS', and full ISO strings.
  const parseApiDate = (value) => {
    if (!value) return new Date()
    if (value instanceof Date) return value
    const s = String(value).trim()
    // YYYY-MM-DD
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/
    if (dateOnly.test(s)) {
      const [y, m, d] = s.split('-').map(Number)
      return new Date(y, m - 1, d)
    }
    // YYYY-MM-DD HH:MM:SS or YYYY-MM-DDTHH:MM:SS
    const dtMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/) 
    if (dtMatch) {
      const [, y, m, d, hh, mm, ss] = dtMatch.map(Number)
      return new Date(y, m - 1, d, hh, mm, ss)
    }
    // Fallback to Date constructor (handles ISO with timezone)
    const parsed = new Date(s)
    if (!isNaN(parsed)) return parsed
    return new Date()
  }

  // Intl formatter for Taiwan (Asia/Taipei) dates in YYYY-MM-DD format
  const taipeiDateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' })

    const addExpense = async ({ name, amount, date }) => {
    try {
      setError(null)
      console.log('Adding expense with date input:', date)
      
      // Ensure date is in local timezone
      // If user provided a YYYY-MM-DD string, keep that day but send Taiwan date
      let formattedDate
      if (date && /^\d{4}-\d{2}-\d{2}$/.test(String(date).trim())) {
        // ensure we send the provided calendar day (as Taiwan date)
        formattedDate = String(date).trim()
      } else {
        // Use Taiwan current date/time (or provided ISO) and format to YYYY-MM-DD in Taipei timezone
        const base = date ? new Date(date) : new Date()
        formattedDate = taipeiDateFormatter.format(base)
      }
      
      const payload = { 
        name: String(name || '').trim(), 
        amount: Number(amount || 0),
        date: formattedDate
      }
      
      if(useServer){
        const saved = await apiCreate(payload)
        console.log('Saved expense from server:', saved)
        setExpenses(prev => [saved, ...prev])
      } else {
        const e = { 
          id: Date.now(),
          ...payload,
          createdAt: new Date().toISOString() 
        }
        console.log('Saved expense locally:', e)
        setExpenses(prev => [e, ...prev])
      }
    } catch (e) {
      console.error('Failed to add expense', e)
      setError('Failed to add expense')
      throw e
    }
  }

  const removeExpense = async (id) => {
    try {
      setError(null)
      if(useServer) await apiDelete(id)
      setExpenses(prev => prev.filter(e => e.id !== id))
    } catch (e) {
      console.error('Failed to remove expense', e)
      setError('Failed to remove expense')
      throw e
    }
  }

  const updateExpense = async (id, patch) => {
    try {
      setError(null)
      if(useServer){
        const updated = await apiUpdate(id, patch)
        setExpenses(prev => prev.map(e => e.id === id ? updated : e))
      } else {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))
      }
    } catch (e) {
      console.error('Failed to update expense', e)
      setError('Failed to update expense')
      throw e
    }
  }

  const clearAll = () => setExpenses([])

  const totals = useMemo(()=>{
    // Use Taiwan date strings for day/week/month comparisons so everything aligns to Asia/Taipei
    const taipeiToday = taipeiDateFormatter.format(new Date())
    console.log('Calculating totals for today (Taipei):', taipeiToday)
    console.log('All expenses:', expenses)

    const daily = expenses.filter(e => {
      const expenseTaipei = taipeiDateFormatter.format(parseApiDate(e.date))
      const isToday = expenseTaipei === taipeiToday
      console.log('Expense:', 'date:', e.date, 'taipei:', expenseTaipei, 'amount:', e.amount, 'isToday:', isToday)
      return isToday
    }).reduce((s,e)=>s+Number(e.amount),0)

    console.log('Daily total calculated:', daily)

    // For weekly/monthly, convert parsed dates into Taipei-based Date objects (midnight Taipei)
    const parseTaipeiDateToLocal = (val) => {
      const dstr = taipeiDateFormatter.format(parseApiDate(val)) // YYYY-MM-DD
      const [y, m, d] = dstr.split('-').map(Number)
      return new Date(y, m-1, d)
    }

    const nowTaipeiDate = parseTaipeiDateToLocal(new Date())
    const weekly = expenses.filter(e => isSameWeek(parseTaipeiDateToLocal(e.date), nowTaipeiDate)).reduce((s,e)=>s+Number(e.amount),0)
    const monthly = expenses.filter(e => isSameMonth(parseTaipeiDateToLocal(e.date), nowTaipeiDate)).reduce((s,e)=>s+Number(e.amount),0)
    
    return { daily, weekly, monthly }
  }, [expenses])

  const byMonth = useMemo(()=>{
    const map = new Map()
    for(const e of expenses){
      const ym = format(parseApiDate(e.date), 'yyyy-MM')
      if(!map.has(ym)) map.set(ym, [])
      map.get(ym).push(e)
    }
    return Array.from(map.entries()).sort((a,b)=> b[0].localeCompare(a[0]))
  }, [expenses])

  const ongoingMonth = useMemo(()=>{
    const today = new Date()
    const ym = format(today, 'yyyy-MM')
    const items = expenses.filter(e => format(parseApiDate(e.date), 'yyyy-MM') === ym)
    const total = items.reduce((s,e)=>s+Number(e.amount),0)
    const until = endOfMonth(today)
    return { ym, items, total, until }
  }, [expenses])

  const value = { 
    expenses, 
    addExpense, 
    removeExpense, 
    updateExpense, 
    clearAll, 
    totals, 
    byMonth, 
    ongoingMonth, 
    useServer,
    isLoading,
    error
  }
  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export function useExpenses(){
  const ctx = useContext(ExpenseContext)
  if(!ctx) throw new Error('useExpenses must be used inside ExpenseProvider')
  return ctx
}
