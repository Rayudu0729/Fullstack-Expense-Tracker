import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/** Export Admin User Activity Report as Excel */
export function exportAdminUsersExcel({ users, generatedDate }) {
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const active = users.filter(u => u.enabled).length;
    const summaryData = [
        ["MyWallet Admin — User Activity Report"],
        [`Generated: ${generatedDate}`],
        [],
        ["Metric", "Value"],
        ["Total Users", users.length],
        ["Active Users", active],
        ["Disabled Users", users.length - active],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet["!cols"] = [{ wch: 22 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

    // Users sheet
    const usersData = [
        ["#", "Username", "Email", "Status"],
        ...users.map((u, i) => [
            i + 1,
            u.username || u.name || "—",
            u.email,
            u.enabled ? "Active" : "Disabled"
        ])
    ];
    const usersSheet = XLSX.utils.aoa_to_sheet(usersData);
    usersSheet["!cols"] = [{ wch: 6 }, { wch: 22 }, { wch: 34 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, usersSheet, "All Users");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `MyWallet-Admin-Users-${generatedDate}.xlsx`);
}

/** Export Admin Transactions Report as Excel */
export function exportAdminTransactionsExcel({ transactions, generatedDate }) {
    const wb = XLSX.utils.book_new();

    const txData = [
        ["#", "User Email", "Category", "Type", "Amount (Rs.)", "Date", "Description"],
        ...transactions.map((t, i) => [
            i + 1,
            t.userEmail || "—",
            t.categoryName || "—",
            t.transactionTypeName || "—",
            Number(t.amount || 0),
            t.date ? new Date(t.date).toLocaleDateString() : "—",
            t.description || "—"
        ])
    ];
    const txSheet = XLSX.utils.aoa_to_sheet(txData);
    txSheet["!cols"] = [{ wch: 5 }, { wch: 30 }, { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, txSheet, "Transactions");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `MyWallet-Admin-Transactions-${generatedDate}.xlsx`);
}
