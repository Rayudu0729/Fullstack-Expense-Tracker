import { useState } from "react";
import Container from "../../components/utils/Container";
import Header from "../../components/utils/header";
import Loading from "../../components/utils/loading";
import Info from "../../components/utils/Info";
import useMonthlyReport from "../../hooks/useMonthlyReport";
import { exportPdf } from "../../utils/exportPdf";
import { exportExcel } from "../../utils/exportExcel";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { Toaster } from "react-hot-toast";

/* ── helpers ── */
function getMonthOptions() {
    const opts = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        opts.push({
            id: d.getMonth() + 1,
            year: d.getFullYear(),
            monthName: d.toLocaleString("en-US", { month: "long" }),
        });
    }
    return opts;
}

const MONTH_OPTIONS = getMonthOptions();
const BAR_COLORS = ["#34d399", "#06b6d4", "#8b5cf6", "#f59e0b", "#f43f5e", "#38bdf8", "#a78bfa", "#fb923c", "#4ade80"];

/* ── stat card ── */
const StatCard = ({ label, value, color, icon }) => (
    <div style={{
        flex: "1 1 160px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${color}30`,
        borderRadius: "16px",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        boxShadow: `0 4px 20px ${color}10`,
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
                fontSize: "20px",
                background: `${color}20`,
                borderRadius: "10px",
                width: 38, height: 38,
                display: "flex", alignItems: "center", justifyContent: "center"
            }}>{icon}</span>
            <span style={{ color: "#64748b", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px", fontFamily: "Inter, sans-serif" }}>
                {label.toUpperCase()}
            </span>
        </div>
        <p style={{ color, fontSize: "24px", fontWeight: 800, fontFamily: "Inter, sans-serif", margin: 0 }}>
            ₹{Number(value).toLocaleString()}
        </p>
    </div>
);

/* ── custom tooltip ── */
const CatTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "rgba(10,20,40,0.95)", border: "1px solid rgba(52,211,153,0.25)",
            borderRadius: "10px", padding: "10px 16px", fontFamily: "Inter, sans-serif",
        }}>
            <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: 4 }}>{payload[0].payload.name}</p>
            <p style={{ color: payload[0].fill, fontWeight: 700, fontSize: "14px", margin: 0 }}>
                ₹{Number(payload[0].value).toLocaleString()}
            </p>
        </div>
    );
};

/* ── main page ── */
function UserReports() {
    const [selectedIdx, setSelectedIdx] = useState(MONTH_OPTIONS.length - 1);
    const currentMonth = MONTH_OPTIONS[selectedIdx];
    const { income, expense, savings, txCount, categorySummary, isLoading, isError } = useMonthlyReport(currentMonth);

    const handleExportPdf = () => exportPdf({ income, expense, savings, txCount, categorySummary, monthName: currentMonth.monthName, year: currentMonth.year });
    const handleExportExcel = () => exportExcel({ income, expense, savings, txCount, categorySummary, monthName: currentMonth.monthName, year: currentMonth.year });

    return (
        <Container activeNavId={10}>
            <Header title="Reports" />
            <Toaster />

            <div style={{ padding: "8px 0 32px", display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* ── Top toolbar ── */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: "12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(52,211,153,0.1)",
                    borderRadius: "16px", padding: "16px 20px",
                }}>
                    {/* Month selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ color: "#64748b", fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>Period</span>
                        <select
                            value={selectedIdx}
                            onChange={e => setSelectedIdx(Number(e.target.value))}
                            style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(52,211,153,0.2)",
                                borderRadius: "10px",
                                color: "#e2e8f0",
                                padding: "8px 14px",
                                fontSize: "13px",
                                fontFamily: "Inter, sans-serif",
                                cursor: "pointer",
                                outline: "none",
                            }}
                        >
                            {MONTH_OPTIONS.map((m, i) => (
                                <option key={i} value={i} style={{ background: "#0a1428" }}>
                                    {m.monthName} {m.year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Export buttons */}
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={handleExportPdf}
                            disabled={isLoading}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                padding: "9px 18px", borderRadius: "10px", border: "none",
                                background: "linear-gradient(135deg, rgba(244,63,94,0.2), rgba(244,63,94,0.1))",
                                boxShadow: "0 0 0 1px rgba(244,63,94,0.35)",
                                color: "#f43f5e", fontSize: "13px", fontWeight: 600,
                                fontFamily: "Inter, sans-serif", cursor: isLoading ? "not-allowed" : "pointer",
                                opacity: isLoading ? 0.5 : 1, transition: "opacity 0.2s",
                            }}
                        >
                            📄 Export PDF
                        </button>
                        <button
                            onClick={handleExportExcel}
                            disabled={isLoading}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                padding: "9px 18px", borderRadius: "10px", border: "none",
                                background: "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(6,182,212,0.1))",
                                boxShadow: "0 0 0 1px rgba(52,211,153,0.35)",
                                color: "#34d399", fontSize: "13px", fontWeight: 600,
                                fontFamily: "Inter, sans-serif", cursor: isLoading ? "not-allowed" : "pointer",
                                opacity: isLoading ? 0.5 : 1, transition: "opacity 0.2s",
                            }}
                        >
                            📊 Export Excel
                        </button>
                    </div>
                </div>

                {/* ── Loading / Error ── */}
                {isLoading && <Loading />}
                {isError && <Info text="Failed to load report data. Please try again later." />}

                {!isLoading && !isError && (
                    <>
                        {/* ── Stat cards ── */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                            <StatCard label="Income" value={income} color="#34d399" icon="💰" />
                            <StatCard label="Expense" value={expense} color="#f43f5e" icon="💸" />
                            <StatCard label="Net Savings" value={savings} color="#06b6d4" icon="🏦" />
                            <div style={{
                                flex: "1 1 160px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(139,92,246,0.3)",
                                borderRadius: "16px", padding: "20px 22px",
                                display: "flex", flexDirection: "column", gap: "10px",
                                boxShadow: "0 4px 20px rgba(139,92,246,0.1)",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{
                                        fontSize: "20px", background: "rgba(139,92,246,0.15)",
                                        borderRadius: "10px", width: 38, height: 38,
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>🔢</span>
                                    <span style={{ color: "#64748b", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px", fontFamily: "Inter, sans-serif" }}>
                                        TRANSACTIONS
                                    </span>
                                </div>
                                <p style={{ color: "#8b5cf6", fontSize: "24px", fontWeight: 800, fontFamily: "Inter, sans-serif", margin: 0 }}>
                                    {txCount}
                                </p>
                            </div>
                        </div>

                        {/* ── Category chart ── */}
                        {categorySummary.length > 0 ? (
                            <div style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(52,211,153,0.12)",
                                borderRadius: "20px", padding: "24px",
                                boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                            }}>
                                <h3 style={{ color: "#34d399", fontSize: "15px", fontWeight: 700, fontFamily: "Inter, sans-serif", marginBottom: "20px", margin: "0 0 20px" }}>
                                    Expenses by Category — {currentMonth.monthName} {currentMonth.year}
                                </h3>
                                <ResponsiveContainer width="100%" height={Math.max(220, categorySummary.length * 46)}>
                                    <BarChart
                                        data={categorySummary}
                                        layout="vertical"
                                        margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
                                        barCategoryGap="25%"
                                    >
                                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                        <XAxis
                                            type="number"
                                            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Inter, sans-serif" }}
                                            axisLine={false} tickLine={false}
                                            tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                                        />
                                        <YAxis
                                            type="category" dataKey="name" width={110}
                                            tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                                            axisLine={false} tickLine={false}
                                        />
                                        <Tooltip content={<CatTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                                        <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                                            {categorySummary.map((_, i) => (
                                                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} opacity={0.9} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <Info text={`No expense data found for ${currentMonth.monthName} ${currentMonth.year}.`} />
                        )}
                    </>
                )}
            </div>
        </Container>
    );
}

export default UserReports;
