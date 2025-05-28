import React from "react";

interface Category {
  id: number;
  name: string;
  budget: number;
}

interface CategoryCardProps {
  category: Category;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const { id, name, budget } = category;

  return (
    <div className="card mb-2">
      <div className="card-body py-2">
        <div className="row align-items-center g-2">
          {/* Name */}
          <div className="col text-truncate fw-semibold">{name}</div>

          {/* Budget */}
          <div className="col-3 col-sm-2 text-end fw-bold">
            ${budget.toFixed(2)}
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

export default CategoryCard;
