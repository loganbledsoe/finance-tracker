import React, { useEffect, useState } from "react";
import { getCategories } from "../api";

interface Transaction {
  id: number;
  amount: number;
  date: string;
  category_id: number;
  description: string;
}

interface Category {
  id: number;
  name: string;
  budget: number;
}

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  categories?: Category[];
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
  categories: propCategories,
}) => {
  const { id, amount, date, category_id, description } = transaction;
  const [categoryName, setCategoryName] = useState<string>("");
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  useEffect(() => {
    if (propCategories) {
      // If categories are provided via props, use them directly
      const category = propCategories.find((cat) => cat.id == category_id);
      setCategoryName(category ? category.name : "Unknown");
    } else {
      // Otherwise fetch from API
      const fetchCategoryData = async () => {
        setIsLoadingCategory(true);
        try {
          const categoriesData = await getCategories();
          const category = categoriesData.find((cat) => cat.id == category_id);
          setCategoryName(category ? category.name : "Unknown");
        } catch (error) {
          console.error("Error fetching category:", error);
          setCategoryName("Unknown");
        } finally {
          setIsLoadingCategory(false);
        }
      };

      fetchCategoryData();
    }
  }, [category_id, propCategories]);

  const formattedDate = new Date(date).toLocaleDateString();
  const amountColor = amount >= 0 ? "text-success" : "text-danger";

  return (
    <div className="card mb-2">
      <div className="card-body py-2">
        <div className="row align-items-center g-2">
          {/* Date */}
          <div className="col-4 col-sm-3 col-lg-2 text-muted">
            {formattedDate}
          </div>

          {/* Description */}
          <div className="col text-truncate fw-semibold">
            {description || "N/A"}
          </div>

          {/* Category */}
          <div className="col-auto text-muted">
            {isLoadingCategory ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              categoryName
            )}
          </div>

          {/* Amount */}
          <div className={`col-3 col-sm-2 text-end fw-bold ${amountColor}`}>
            {amount.toFixed(2)}
          </div>

          {/* Actions */}
          <div className="col-auto text-end">
            <button
              className="btn btn-sm btn-outline-primary me-1"
              onClick={() => onEdit(id)}
              title="Edit"
            >
              Edit
              <i className="bi bi-pencil-square" />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(id)}
              title="Delete"
            >
              Delete
              <i className="bi bi-trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
