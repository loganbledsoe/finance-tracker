import React, { useState, useEffect } from "react";
import { getCategories } from "../api";

export interface TransactionModel {
  id?: number;
  amount: number;
  date: string;
  category_id: number;
  description: string;
}

// Define the Category model
export interface Category {
  id: number;
  name: string;
  budget: number;
}

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: TransactionModel) => Promise<void>;
  transaction?: TransactionModel;
  title?: string;
  categories?: Category[];
}

const defaultTransaction: TransactionModel = {
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  category_id: 1,
  description: "",
};

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  transaction,
  title,
  categories: propCategories,
}) => {
  const [formData, setFormData] =
    useState<TransactionModel>(defaultTransaction);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    if (isOpen && !propCategories) {
      fetchCategories();
    } else if (isOpen && propCategories) {
      // Use categories from props if available
      setCategories(propCategories);
      setIsLoadingCategories(false);
    }
  }, [isOpen, propCategories]);

  // Function to fetch categories
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      if (categoriesData.length === 0) {
        setError("No categories available. Please create a category first.");
      }
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(
        transaction
          ? { ...transaction, date: transaction.date.split("T")[0] }
          : categories.length
          ? { ...defaultTransaction, category_id: categories[0].id }
          : defaultTransaction
      );
      setError(null);
    }
  }, [isOpen, transaction, categories]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        date: formData.date.includes("T")
          ? formData.date
          : `${formData.date}T00:00:00.000Z`,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message || "Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalTitle =
    title || (transaction?.id ? "Edit Transaction" : "Add Transaction");

  return (
    <>
      <div className="modal-backdrop fade show" style={{ display: "block" }} />
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex={-1}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                {/* Amount field */}
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Amount
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      required
                    />
                  </div>
                  <small className="text-muted">
                    Use negative for expenses
                  </small>
                </div>

                {/* Date field */}
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category field */}
                <div className="mb-3">
                  <label htmlFor="category_id" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                  >
                    {isLoadingCategories ? (
                      <option value="">Loading categories...</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Description field */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />{" "}
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionFormModal;
