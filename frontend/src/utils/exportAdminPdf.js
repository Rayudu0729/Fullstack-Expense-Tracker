import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/** Export Admin User Activity Report as PDF */
export function exportAdminUsersPdf({ users, generatedDate }) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(10, 20, 40);
    doc.rect(0, 0, pageW, 36, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(52, 211, 153);
    doc.text("MyWallet Admin", 14, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.text("User Activity Report", 14, 24);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${generatedDate}`, pageW - 14, 31, { align: "right" });

    // Summary
    const active = users.filter(u => u.enabled).length;
    const disabled = users.length - active;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text("Summary", 14, 48);
    autoTable(doc, {
        startY: 52,
        head: [["Metric", "Value"]],
        body: [
            ["Total Users", users.length.toString()],
            ["Active Users", active.toString()],
            ["Disabled Users", disabled.toString()],
        ],
        headStyles: { fillColor: [10, 20, 40], textColor: [52, 211, 153], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        columnStyles: { 0: { cellWidth: 80 }, 1: { halign: "right" } },
        styles: { fontSize: 11, cellPadding: 5 },
    });

    // User table
    const afterSummary = doc.lastAutoTable.finalY + 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text("All Users", 14, afterSummary);
    autoTable(doc, {
        startY: afterSummary + 4,
        head: [["#", "Username", "Email", "Status"]],
        body: users.map((u, i) => [
            i + 1,
            u.username || u.name || "—",
            u.email,
            u.enabled ? "Active" : "Disabled"
        ]),
        headStyles: { fillColor: [10, 20, 40], textColor: [52, 211, 153], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 3: { halign: "center" } },
    });

    // Footer
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("MyWallet Admin — Confidential", pageW / 2, pageH - 8, { align: "center" });

    doc.save(`MyWallet-Admin-Users-${generatedDate}.pdf`);
}

/** Export Admin Transactions Report as PDF */
export function exportAdminTransactionsPdf({ transactions, generatedDate }) {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(10, 20, 40);
    doc.rect(0, 0, pageW, 36, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(52, 211, 153);
    doc.text("MyWallet Admin", 14, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.text("Platform Transactions Report", 14, 24);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${generatedDate}`, pageW - 14, 31, { align: "right" });

    // Transactions table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(`All Transactions (${transactions.length})`, 14, 48);
    autoTable(doc, {
        startY: 52,
        head: [["#", "User", "Category", "Type", "Amount (Rs.)", "Date", "Description"]],
        body: transactions.map((t, i) => [
            i + 1,
            t.userEmail || "—",
            t.categoryName || "—",
            t.transactionTypeName || "—",
            Number(t.amount || 0).toLocaleString(),
            t.date ? new Date(t.date).toLocaleDateString() : "—",
            t.description || "—"
        ]),
        headStyles: { fillColor: [10, 20, 40], textColor: [52, 211, 153], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: { 4: { halign: "right" } },
    });

    const pageH = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("MyWallet Admin — Confidential", pageW / 2, pageH - 8, { align: "center" });

    doc.save(`MyWallet-Admin-Transactions-${generatedDate}.pdf`);
}
