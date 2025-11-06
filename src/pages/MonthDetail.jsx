import "./MonthDetail.scss";
import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import ExpenseList from "../components/ExpenseList.jsx";
import TimeRangeSelector from "../components/TimeRangeSelector.jsx";
import { useExpenses } from "../context/ExpenseContext.jsx";
import { fmtMoney, ymLabel, parseToDate } from "../utils/date";
import { isSameDay, isSameWeek } from "date-fns";
export default function MonthDetail() {
  const { ym } = useParams();
  const { byMonth } = useExpenses();
  const [range, setRange] = useState("monthly");
  const items = (byMonth.find(([key]) => key === ym) || [ym, []])[1];
  const total = useMemo(
    () => items.reduce((s, e) => s + Number(e.amount), 0),
    [items]
  );
  const now = parseToDate(new Date())
  const filtered = useMemo(() => {
    if (range === "monthly") return items;
    if (range === "daily")
      return items.filter((e) => isSameDay(parseToDate(e.date), now));
    if (range === "weekly")
      return items.filter((e) => isSameWeek(parseToDate(e.date), now));
    return items;
  }, [items, range]);
  return (
    <div className='container'>
      <div className='top'>
        <h2 style={{ margin: "12px 0" }}>
          {ymLabel(ym)} — Total {fmtMoney(total)}
        </h2>
        <div className='filters'>
          <TimeRangeSelector value={range} onChange={setRange} />
          <Link to='/'>
            <button className='ghost'>Back</button>
          </Link>
        </div>
      </div>
      <ExpenseList items={filtered} />
    </div>
  );
}
