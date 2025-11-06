import "./Home.scss";
import { Link } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext.jsx";
import { fmtMoney, ymLabel } from "../utils/date";
import StatsCards from "../components/StatsCards.jsx";
import Loading from "../components/Loading.jsx";
import { useState, useEffect, useMemo, useCallback } from "react";

export default function Home() {
  const { totals, ongoingMonth, byMonth, isLoading, error } = useExpenses();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isStatsVisible, setIsStatsVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Memoize previous months calculation
  const previousMonths = useMemo(
    () => byMonth.filter(([ym]) => ym !== ongoingMonth.ym),
    [byMonth, ongoingMonth.ym]
  );

  // Calculate paginated months
  const paginatedMonths = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return previousMonths.slice(startIndex, startIndex + itemsPerPage);
  }, [previousMonths, currentPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(previousMonths.length / itemsPerPage)
  );

  // Calculate total spending across all months
  const totalSpending = useMemo(
    () =>
      previousMonths.reduce(
        (total, [_, items]) =>
          total + items.reduce((sum, e) => sum + Number(e.amount), 0),
        0
      ),
    [previousMonths]
  );

  // Handle month selection
  const handleMonthSelect = useCallback((ym) => {
    setSelectedMonth(ym);
  }, []);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedMonth(null);
  }, [byMonth]);

  // Toggle stats visibility after initial load
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsStatsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className='container section'>Error: {error}</div>;
  }
  console.log("DAYLY", totals);
  return (
    <div className='home container section'>
      <div className="main-month">
        <h2>{ymLabel(ongoingMonth.ym)}</h2>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: "12px 0" }}>Dashboard</h2>

        <Link to='/add'>
          <button>Add Expense</button>
        </Link>
      </div>
      <div
        style={{
          opacity: isStatsVisible ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <StatsCards
          daily={totals.daily}
          weekly={totals.weekly}
          monthly={totals.monthly}
          monthItems={ongoingMonth.items}
        />
      </div>
      <div className='card'>
        <h3 style={{ marginTop: 0 }}>
          Ongoing Month — {ymLabel(ongoingMonth.ym)}{" "}
          <span className='muted'>
            (until{" "}
            {new Intl.DateTimeFormat(undefined, {
              timeZone: "Asia/Taipei",
            }).format(new Date(ongoingMonth.until))}
            )
          </span>
        </h3>
        <div>
          Total: <b>{fmtMoney(ongoingMonth.total)}</b>
        </div>
        <div style={{ marginTop: 10 }}>
          <Link to={`/month/${ongoingMonth.ym}`}>
            <button className='ghost'>Open details</button>
          </Link>
        </div>
      </div>
      <div className='card'>
        <h3 style={{ marginTop: 0 }}>
          Previous Months
          {previousMonths.length > 0 && (
            <span
              className='muted'
              style={{ fontSize: "0.9em", marginLeft: "10px" }}
            >
              (Total: {fmtMoney(totalSpending)})
            </span>
          )}
        </h3>
        <div className='months'>
          {previousMonths.length === 0 && (
            <div className='muted'>No previous months yet.</div>
          )}
          {paginatedMonths.map(([ym, items]) => {
            const isSelected = selectedMonth === ym;
            const monthlyTotal = items.reduce(
              (s, e) => s + Number(e.amount),
              0
            );

            return (
              <div
                className={`month-row ${isSelected ? "selected" : ""}`}
                key={ym}
                onClick={() => handleMonthSelect(ym)}
                style={{
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#f0f0f0" : "transparent",
                  transition: "background-color 0.2s",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>{ymLabel(ym)}</div>
                  <div className='muted'>
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>
                    {fmtMoney(monthlyTotal)}
                  </div>
                  <Link
                    to={`/month/${ym}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className='ghost'>View</button>
                  </Link>
                </div>
              </div>
            );
          })}
          {previousMonths.length > itemsPerPage && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <button
                className='ghost'
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
              >
                Previous
              </button>
              <div
                style={{
                  color: "var(--text)",
                  fontSize: "14px",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: "var(--panel)",
                  border: "1px solid rgba(255,255,255,.06)",
                }}
              >
                Page {currentPage} of {totalPages}
              </div>
              <button
                className='ghost'
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
