import React, { useState, useEffect } from "react";
import { getTransactions } from "../api";

interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
}

const FinancialSummary: React.FC = () => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const transactions = await getTransactions();

        // Get current date and date from one month ago
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        // Filter transactions from the last month
        const recentTransactions = transactions.filter((tx) => {
          const txDate = new Date(tx.date);
          return txDate >= oneMonthAgo && txDate <= now;
        });

        // Calculate income (positive amounts) and expenses (negative amounts)
        const summary = recentTransactions.reduce(
          (acc, tx) => {
            if (tx.amount >= 0) {
              acc.totalIncome += tx.amount;
            } else {
              acc.totalExpenses += Math.abs(tx.amount);
            }
            return acc;
          },
          {
            totalIncome: 0,
            totalExpenses: 0,
          }
        );

        setSummaryData(summary);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load transactions"
        );
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <div className="card h-100 summary-card income-card">
          <div className="card-body">
            <h5 className="card-title">Income This Month</h5>
            <p className="card-text display-4 text-success">
              ${summaryData.totalIncome.toFixed(2)}
            </p>
            <p className="card-text text-muted">
              Money you've earned in the past 30 days
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-3">
        <div className="card h-100 summary-card expense-card">
          <div className="card-body">
            <h5 className="card-title">Expenses This Month</h5>
            <p className="card-text display-4 text-danger">
              ${summaryData.totalExpenses.toFixed(2)}
            </p>
            <p className="card-text text-muted">
              Money you've spent in the past 30 days
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 mt-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Balance</h5>
            <p
              className={`card-text display-5 ${
                summaryData.totalIncome - summaryData.totalExpenses >= 0
                  ? "text-success"
                  : "text-danger"
              }`}
            >
              $
              {(summaryData.totalIncome - summaryData.totalExpenses).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
