import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import PasswordGate from './components/PasswordGate.jsx'
import Home from './pages/Home.jsx'
import AddExpense from './pages/AddExpense.jsx'
import MonthDetail from './pages/MonthDetail.jsx'
import { ExpenseProvider } from './context/ExpenseContext.jsx'
export default function App(){
  return (
    <PasswordGate password="yasas">
      <ExpenseProvider>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/add" element={<AddExpense/>}/>
          <Route path="/month/:ym" element={<MonthDetail/>}/>
          <Route path="*" element={<Navigate to='/'/>}/>
        </Routes>
      </ExpenseProvider>
    </PasswordGate>
  )
}
