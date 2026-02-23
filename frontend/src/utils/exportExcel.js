import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Exports a monthly expense report as an Excel (.xlsx) file with 2 sheets.
 * @param {{ income, expense, savings, txCount, categorySummary, monthName, year }} reportData
 */
export function exportExcel({ income, expense, savings, txCount, categorySummary, monthName, year }) {
    const wb = XLSX.utils.book_new();

    // ── Sheet 1: Summary ─────────────────────────────────────────────────────
    const summaryData = [
        ["MyWallet — Monthly Report"],
        [`Period: ${monthName} ${year}`],
        [`Generated: ${new Date().toLocaleDateString()}`],
        [],
        ["Metric", "Value"],
        ["Total Income (Rs.)", income],
        ["Total Expense (Rs.)", expense],
        ["Net Savings (Rs.)", savings],
        ["No. of Transactions", txCount],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet["!cols"] = [{ wch: 28 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

    // ── Sheet 2: Category Breakdown ──────────────────────────────────────────
    const totalExp = categorySummary.reduce((s, c) => s + c.amount, 0) || 1;
    const catData = [
        ["Category", "Amount (Rs.)", "% of Expense"],
        ...categorySummary.map(c => [
            c.name,
            c.amount,
            parseFloat(((c.amount / totalExp) * 100).toFixed(1))
        ])
    ];
    const catSheet = XLSX.utils.aoa_to_sheet(catData);
    catSheet["!cols"] = [{ wch: 24 }, { wch: 16 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, catSheet, "Category Breakdown");

    // ── Download ─────────────────────────────────────────────────────────────
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `MyWallet-Report-${monthName}-${year}.xlsx`);
}
