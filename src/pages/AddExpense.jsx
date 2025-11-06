import "./AddExpense.scss";
import { useMemo } from "react";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import Loading from "../components/Loading.jsx";
import { useExpenses } from "../context/ExpenseContext.jsx";
import useLocalStorage from "../hooks/useLocalStorage";
export default function AddExpense() {
  const { expenses, addExpense, removeExpense, clearAll, isLoading } = useExpenses();
  
  if (isLoading) {
    return <Loading />;
  }
  const [query, setQuery] = useLocalStorage("exp_query", "");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? expenses.filter((e) => e.name.toLowerCase().includes(q))
      : expenses;
  }, [expenses, query]);
  return (
    <div className='container layout'>
      <div className='toolbar'>
        <h2 style={{ margin: "12px 0" }}>Add Expenses</h2>
        <div>
          <input
            placeholder='Search by name...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
         {/*  <button className='ghost' onClick={() => exportJSON(expenses)}>
            Export
          </button>
          <label
            className='ghost'
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              cursor: "pointer",
            }}
          >
            Import JSON
            <input
              type='file'
              accept='application/json'
              style={{ display: "none" }}
              onChange={handleImport(clearAll)}
            />
          </label> */}
        </div>
      </div>
      <ExpenseForm onSubmit={addExpense} />
      <ExpenseList items={filtered} onDelete={removeExpense} />
    </div>
  );
}
function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.json";
  a.click();
  URL.revokeObjectURL(url);
}
function handleImport(clearAll) {
  return (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arr = JSON.parse(reader.result);
        if (!Array.isArray(arr)) throw new Error("Invalid format");
        localStorage.setItem("expenses_v1", JSON.stringify(arr));
        window.location.reload();
      } catch (err) {
        alert("Import failed: " + err.message);
      }
    };
    reader.readAsText(file);
  };
}
