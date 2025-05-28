import React, { useState, useEffect } from "react";
import CategoryCard from "../components/CategoryCard";
import CategoryFormModal from "../components/CategoryFormModal";
import type { CategoryModel } from "../components/CategoryFormModal";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api";

type Category = CategoryModel & { id: number };

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(
    undefined
  );

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      // Sort alphabetically by name
      setCategories(data.sort((a, b) => a.name.localeCompare(b.name)));
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

  // Open modal for adding a new category
  const handleAdd = () => {
    setCurrentCategory(undefined);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing category
  const handleEdit = (id: number) => {
    const categoryToEdit = categories.find((c) => c.id === id);
    if (categoryToEdit) {
      setCurrentCategory(categoryToEdit);
      setIsModalOpen(true);
    }
  };

  // Handle saving a category (create or update)
  const handleSaveCategory = async (categoryData: CategoryModel) => {
    try {
      if (categoryData.id) {
        // Update existing category
        const updated = await updateCategory(
          categoryData.id,
          categoryData.name,
          categoryData.budget
        );
        setCategories((prevCategories) =>
          prevCategories.map((c) => (c.id == updated.id ? updated : c))
        );
      } else {
        // Create new category
        const newCategory = await createCategory(
          categoryData.name,
          categoryData.budget
        );
        setCategories((prevCategories) =>
          [...prevCategories, newCategory].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
      }
    } catch (e) {
      console.error("Category save failed:", e);
      throw e;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories((c) => c.filter((x) => x.id !== id));
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
        <h2 className="mb-0">Categories</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Category
        </button>
      </div>

      <div
        className="border rounded p-2"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {categories.length ? (
          categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-center m-0">No categories yet. Add one!</p>
        )}
      </div>

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={currentCategory}
      />
    </div>
  );
};

export default CategoriesPage;
