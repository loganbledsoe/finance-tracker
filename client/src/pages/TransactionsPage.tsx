import React, { useState, useEffect } from "react";
import TransactionCard from "../components/TransactionCard";
import TransactionFormModal from "../components/TransactionFormModal";
import type { TransactionModel } from "../components/TransactionFormModal";
import {
  getTransactions,
  getCategories,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api";

// Category interface
interface Category {
  id: number;
  name: string;
  budget: number;
}

type Transaction = TransactionModel & { id: number };

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<
    Transaction | undefined
  >(undefined);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [transactionsData, categoriesData] = await Promise.all([
        getTransactions(),
        getCategories(),
      ]);

      setTransactions(
        transactionsData.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setCategories(categoriesData);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAdd = () => {
    setCurrentTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const transactionToEdit = transactions.find((t) => t.id === id);
    if (transactionToEdit) {
      setCurrentTransaction(transactionToEdit);
      setIsModalOpen(true);
    }
  };

  // Handle saving a transaction (create or update)
  const handleSaveTransaction = async (transactionData: TransactionModel) => {
    try {
      if (transactionData.id) {
        // Update existing transaction
        const updated = await updateTransaction(transactionData.id, {
          amount: transactionData.amount,
          date: transactionData.date,
          category_id: transactionData.category_id,
          description: transactionData.description,
        });
        console.log("Updated id: ", typeof updated.id);
        setTransactions((prevTransactions) =>
          prevTransactions.map((t) => (t.id == updated.id ? updated : t))
        );
      } else {
        // Create new transaction
        const newTransaction = await createTransaction({
          amount: transactionData.amount,
          date: transactionData.date,
          category_id: transactionData.category_id,
          description: transactionData.description,
        });
        setTransactions((prevTransactions) => [
          newTransaction,
          ...prevTransactions,
        ]);
      }
    } catch (e) {
      console.error("Transaction save failed:", e);
      throw e;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      setTransactions((t) => t.filter((x) => x.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed: " + (e as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status" aria-label="Loading" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Transactions</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Transaction
        </button>
      </div>

      <div
        className="border rounded p-2"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {transactions.length ? (
          transactions.map((t) => (
            <TransactionCard
              key={t.id}
              transaction={t}
              onEdit={handleEdit}
              onDelete={handleDelete}
              categories={categories}
            />
          ))
        ) : (
          <p className="text-center m-0">No transactions yet. Add one!</p>
        )}
      </div>

      {/* Transaction Form Modal */}
      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        transaction={currentTransaction}
        categories={categories}
      />
    </div>
  );
};

export default TransactionsPage;
