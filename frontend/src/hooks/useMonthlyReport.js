import { useEffect, useState } from "react";
import useCategories from "./useCategories";
import UserService from "../services/userService";
import AuthService from "../services/auth.service";

function useMonthlyReport(currentMonth) {
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [txCount, setTxCount] = useState(0);
    const [categorySummary, setCategorySummary] = useState([]);
    const [trend, setTrend] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [categories] = useCategories();

    const savings = income > expense ? Number((income - expense).toFixed(2)) : 0;

    useEffect(() => {
        if (!currentMonth || !categories) return;

        const fetchAll = async () => {
            setIsLoading(true);
            setIsError(false);
            const user = AuthService.getCurrentUser();

            try {
                // --- Income ---
                const incRes = await UserService.getTotalIncomeOrExpense(user.id, 2, currentMonth.id, currentMonth.year);
                if (incRes.data.status === "SUCCESS") {
                    setIncome(Number(incRes.data.response ? incRes.data.response.toFixed(2) : 0));
                }

                // --- Expense ---
                const expRes = await UserService.getTotalIncomeOrExpense(user.id, 1, currentMonth.id, currentMonth.year);
                if (expRes.data.status === "SUCCESS") {
                    setExpense(Number(expRes.data.response ? expRes.data.response.toFixed(2) : 0));
                }

                // --- Transaction count ---
                const txRes = await UserService.getTotalNoOfTransactions(user.id, currentMonth.id, currentMonth.year);
                if (txRes.data.status === "SUCCESS") {
                    setTxCount(txRes.data.response);
                }

                // --- Category breakdown (expense categories only) ---
                const catResults = [];
                await Promise.all(
                    categories
                        .filter(c => c.transactionType.transactionTypeId === 1)
                        .map(async (cat) => {
                            try {
                                const r = await UserService.getTotalByCategory(user.email, cat.categoryId, currentMonth.id, currentMonth.year);
                                if (r.data.status === "SUCCESS" && r.data.response) {
                                    catResults.push({ name: cat.categoryName, amount: Number(r.data.response.toFixed(2)) });
                                }
                            } catch (_) { }
                        })
                );
                setCategorySummary(catResults.sort((a, b) => b.amount - a.amount));

                // --- 12-month trend ---
                const trendRes = await UserService.getMonthlySummary(user.email);
                if (trendRes.data.status === "SUCCESS") {
                    setTrend(trendRes.data.response || []);
                }
            } catch (e) {
                setIsError(true);
            }

            setIsLoading(false);
        };

        fetchAll();
    }, [currentMonth, categories]);

    return { income, expense, savings, txCount, categorySummary, trend, isLoading, isError };
}

export default useMonthlyReport;
