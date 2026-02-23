import { useState, useEffect } from "react";
import Container from "../../components/utils/Container";
import Header from "../../components/utils/header";
import Loading from "../../components/utils/loading";
import Info from "../../components/utils/Info";
import AdminService from "../../services/adminService";
import { exportAdminUsersPdf, exportAdminTransactionsPdf } from "../../utils/exportAdminPdf";
import { exportAdminUsersExcel, exportAdminTransactionsExcel } from "../../utils/exportAdminExcel";
import { Toaster } from "react-hot-toast";

const today = new Date().toLocaleDateString();

/* ── Stat card ── */
const StatCard = ({ label, value, color, icon }) => (
    <div style={{
        flex: "1 1 150px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${color}30`,
        borderRadius: "16px",
        padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: "10px",
        boxShadow: `0 4px 20px ${color}10`,
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
                fontSize: "18px", background: `${color}18`,
                borderRadius: "10px", width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>{icon}</span>
            <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 600, letterSpacing: "0.5px", fontFamily: "Inter, sans-serif" }}>
                {label.toUpperCase()}
            </span>
        </div>
        <p style={{ color, fontSize: "26px", fontWeight: 800, fontFamily: "Inter, sans-serif", margin: 0 }}>{value}</p>
    </div>
);

/* ── Export toolbar ── */
const ExportBar = ({ onPdf, onExcel, disabled }) => (
    <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onPdf} disabled={disabled} style={btnStyle("#f43f5e", disabled)}>📄 Export PDF</button>
        <button onClick={onExcel} disabled={disabled} style={btnStyle("#34d399", disabled)}>📊 Export Excel</button>
    </div>
);
const btnStyle = (color, disabled) => ({
    display: "flex", alignItems: "center", gap: "8px",
    padding: "8px 16px", borderRadius: "10px", border: "none",
    background: `linear-gradient(135deg, ${color}25, ${color}12)`,
    boxShadow: `0 0 0 1px ${color}40`,
    color, fontSize: "13px", fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "opacity 0.2s",
});

/* ── Section wrapper card ── */
const SectionCard = ({ children }) => (
    <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(52,211,153,0.1)",
        borderRadius: "20px", padding: "24px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
    }}>
        {children}
    </div>
);

/* ── Data table ── */
const DataTable = ({ headers, rows }) => (
    <div style={{ overflowX: "auto", marginTop: "16px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif", fontSize: "13px" }}>
            <thead>
                <tr>
                    {headers.map(h => (
                        <th key={h} style={{
                            padding: "10px 12px", textAlign: "left",
                            color: "#34d399", fontWeight: 600, fontSize: "11px",
                            letterSpacing: "0.5px", textTransform: "uppercase",
                            borderBottom: "1px solid rgba(52,211,153,0.15)",
                        }}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                        {row.map((cell, ci) => (
                            <td key={ci} style={{
                                padding: "9px 12px", color: "#cbd5e1",
                                borderBottom: "1px solid rgba(255,255,255,0.04)",
                            }}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

/* ── Tab nav ── */
const TAB_LABELS = ["👥 User Activity", "💳 Transactions"];

function AdminReports() {
    const [activeTab, setActiveTab] = useState(0);

    // Users state
    const [users, setUsers] = useState([]);
    const [usersLoading, setULoad] = useState(true);
    const [usersError, setUError] = useState(false);

    // Transactions state
    const [txns, setTxns] = useState([]);
    const [txSearch, setTxSearch] = useState("");
    const [txLoading, setTxLoad] = useState(true);
    const [txError, setTxError] = useState(false);

    /* ─ fetch all users ─ */
    useEffect(() => {
        setULoad(true);
        AdminService.getAllUsers(0, 1000, "")
            .then(res => {
                if (res.data.status === "SUCCESS") {
                    setUsers(res.data.response?.data || []);
                } else setUError(true);
            })
            .catch(() => setUError(true))
            .finally(() => setULoad(false));
    }, []);

    /* ─ fetch all transactions ─ */
    useEffect(() => {
        setTxLoad(true);
        AdminService.getAllTransactions(0, 1000, "")
            .then(res => {
                if (res.data.status === "SUCCESS") {
                    setTxns(res.data.response?.data || []);
                } else setTxError(true);
            })
            .catch(() => setTxError(true))
            .finally(() => setTxLoad(false));
    }, []);

    /* ─ derived ─ */
    const activeUsers = users.filter(u => u.enabled).length;
    const disabledUsers = users.length - activeUsers;
    const totalTxAmt = txns.reduce((s, t) => s + (t.amount || 0), 0);
    const filteredTxns = txns.filter(t =>
        [t.userEmail, t.description, t.categoryName, t.transactionTypeName]
            .some(v => (v || "").toLowerCase().includes(txSearch.toLowerCase()))
    );

    return (
        <Container activeNavId={12}>
            <Header title="Admin Reports" />
            <Toaster />

            <div style={{ padding: "8px 0 32px", display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* ── Tab bar ── */}
                <div style={{
                    display: "flex", gap: "6px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(52,211,153,0.1)",
                    borderRadius: "14px", padding: "6px",
                    width: "fit-content",
                }}>
                    {TAB_LABELS.map((label, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            style={{
                                padding: "8px 20px", borderRadius: "10px", border: "none",
                                fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600,
                                cursor: "pointer", transition: "all 0.2s",
                                background: activeTab === i
                                    ? "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(6,182,212,0.15))"
                                    : "transparent",
                                color: activeTab === i ? "#34d399" : "#64748b",
                                boxShadow: activeTab === i ? "0 0 0 1px rgba(52,211,153,0.3)" : "none",
                            }}
                        >{label}</button>
                    ))}
                </div>

                {/* ══ TAB: USER ACTIVITY ══ */}
                {activeTab === 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Stat cards */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                            <StatCard label="Total Users" value={users.length} color="#34d399" icon="👤" />
                            <StatCard label="Active Users" value={activeUsers} color="#06b6d4" icon="✅" />
                            <StatCard label="Disabled Users" value={disabledUsers} color="#f43f5e" icon="🚫" />
                        </div>

                        <SectionCard>
                            {/* Header row */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                                <div>
                                    <h3 style={{ color: "#34d399", fontSize: "15px", fontWeight: 700, fontFamily: "Inter, sans-serif", margin: 0 }}>All Users</h3>
                                    <p style={{ color: "#64748b", fontSize: "12px", marginTop: 4, fontFamily: "Inter, sans-serif" }}>{users.length} total users registered</p>
                                </div>
                                <ExportBar
                                    disabled={usersLoading || usersError}
                                    onPdf={() => exportAdminUsersPdf({ users, generatedDate: today })}
                                    onExcel={() => exportAdminUsersExcel({ users, generatedDate: today })}
                                />
                            </div>

                            {usersLoading && <Loading />}
                            {usersError && <Info text="Failed to load users." />}
                            {!usersLoading && !usersError && (
                                <DataTable
                                    headers={["#", "Username", "Email", "Expense", "Income", "Transactions", "Status"]}
                                    rows={users.map((u, i) => [
                                        i + 1,
                                        u.username || "—",
                                        u.email,
                                        `Rs. ${u.expense || 0}`,
                                        `Rs. ${u.income || 0}`,
                                        u.noOfTransactions || 0,
                                        <span style={{
                                            padding: "2px 10px", borderRadius: 99, fontSize: "11px", fontWeight: 600,
                                            background: u.enabled ? "rgba(52,211,153,0.15)" : "rgba(244,63,94,0.15)",
                                            color: u.enabled ? "#34d399" : "#f43f5e",
                                        }}>{u.enabled ? "Active" : "Disabled"}</span>
                                    ])}
                                />
                            )}
                        </SectionCard>
                    </div>
                )}

                {/* ══ TAB: TRANSACTIONS ══ */}
                {activeTab === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Stat cards */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                            <StatCard label="Total Transactions" value={txns.length} color="#8b5cf6" icon="🔢" />
                            <StatCard label="Total Volume" value={`₹${Math.round(totalTxAmt).toLocaleString()}`} color="#f59e0b" icon="💹" />
                        </div>

                        <SectionCard>
                            {/* Header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                                <div>
                                    <h3 style={{ color: "#34d399", fontSize: "15px", fontWeight: 700, fontFamily: "Inter, sans-serif", margin: 0 }}>Platform Transactions</h3>
                                    <p style={{ color: "#64748b", fontSize: "12px", marginTop: 4, fontFamily: "Inter, sans-serif" }}>{txns.length} total transactions</p>
                                </div>
                                <ExportBar
                                    disabled={txLoading || txError}
                                    onPdf={() => exportAdminTransactionsPdf({ transactions: txns, generatedDate: today })}
                                    onExcel={() => exportAdminTransactionsExcel({ transactions: txns, generatedDate: today })}
                                />
                            </div>

                            {/* Search */}
                            <div style={{ marginTop: "16px" }}>
                                <input
                                    placeholder="Search by user, category, description…"
                                    value={txSearch}
                                    onChange={e => setTxSearch(e.target.value)}
                                    style={{
                                        width: "100%", maxWidth: 360,
                                        padding: "9px 14px", borderRadius: "10px",
                                        border: "1px solid rgba(52,211,153,0.2)",
                                        background: "rgba(255,255,255,0.05)",
                                        color: "#e2e8f0", fontSize: "13px",
                                        fontFamily: "Inter, sans-serif", outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {txLoading && <Loading />}
                            {txError && <Info text="Failed to load transactions." />}
                            {!txLoading && !txError && (
                                filteredTxns.length > 0 ? (
                                    <DataTable
                                        headers={["#", "User", "Category", "Type", "Amount", "Date", "Description"]}
                                        rows={filteredTxns.map((t, i) => [
                                            i + 1,
                                            t.userEmail || "—",
                                            t.categoryName || "—",
                                            <span style={{
                                                padding: "2px 9px", borderRadius: 99, fontSize: "11px", fontWeight: 600,
                                                background: t.transactionType === 2 ? "rgba(52,211,153,0.15)" : "rgba(244,63,94,0.15)",
                                                color: t.transactionType === 2 ? "#34d399" : "#f43f5e",
                                            }}>{t.transactionType === 2 ? "Income" : "Expense"}</span>,
                                            `₹${Number(t.amount || 0).toLocaleString()}`,
                                            t.date ? new Date(t.date).toLocaleDateString() : "—",
                                            t.description || "—"
                                        ])}
                                    />
                                ) : <Info text="No transactions found." />
                            )}
                        </SectionCard>
                    </div>
                )}
            </div>
        </Container>
    );
}

export default AdminReports;
