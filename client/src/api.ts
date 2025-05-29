// src/api.ts
const BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;
const USER_ID = "1"; // temporary hardcoded user ID for testing

interface Category {
  id: number;
  name: string;
  budget: number;
}

interface Transaction {
  id: number;
  amount: number;
  date: string;
  category_id: number;
  description: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "user-id": USER_ID,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || res.statusText);
  }
  if (res.status === 204) {
    return Promise.resolve({} as T);
  }
  return (await res.json()) as T;
}

// Categories

export const getCategories = () =>
  request<Category[]>("/categories", { method: "GET" });

export const createCategory = (name: string, budget: number = 0) =>
  request<Category>("/categories", {
    method: "POST",
    body: JSON.stringify({ name, budget }),
  });

export const updateCategory = (id: number, name: string, budget?: number) =>
  request<Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, ...(budget !== undefined ? { budget } : {}) }),
  });

export const deleteCategory = (id: number) =>
  request<{}>(`/categories/${id}`, { method: "DELETE" });

// Transactions

export const getTransactions = () =>
  request<Transaction[]>("/transactions", { method: "GET" });

export const createTransaction = (tx: Omit<Transaction, "id">) =>
  request<Transaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(tx),
  });

export const updateTransaction = (id: number, tx: Omit<Transaction, "id">) =>
  request<Transaction>(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(tx),
  });

export const deleteTransaction = (id: number) =>
  request<{}>(`/transactions/${id}`, { method: "DELETE" });
