import { api } from "./apiClient";
import { formatToYYYYMMDDTaipei } from '../utils/date'
export async function fetchExpenses() {
  const expenses = await api("/api/expenses");
  console.log('Fetched expenses from API:', expenses);
  return expenses;
}
export async function createExpense(payload) {
  // Format data according to Laravel's migration schema
  const formattedPayload = {
    name: String(payload.name || '').trim(),
    amount: Number(payload.amount || 0), // Send as number, let Laravel handle decimal conversion
    date: formatToYYYYMMDDTaipei(payload.date || new Date())
  };

  // Log the payload for debugging
  console.log('Creating expense with payload:', formattedPayload);
  
  return api("/api/expenses", { method: "POST", body: formattedPayload });
}
export async function deleteExpense(id) {
  return api(`/api/expenses/${id}`, { method: "DELETE" });
}
export async function updateExpense(id, patch) {
  return api(`/api/expenses/${id}`, { method: "PATCH", body: patch });
}
