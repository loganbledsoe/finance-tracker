import { Router } from "express";
import db from "./db";

const router = Router();

// Get all categories for a user
router.get("/", async (req, res) => {
  const userId = req.header("user-id");
  try {
    const categories = await db("categories").where({ user_id: userId });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new category
router.post("/", async (req, res) => {
  const userId = req.header("user-id");
  const { name, budget } = req.body;
  if (!name || !budget) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }
  try {
    const [id] = await db("categories").insert({
      name,
      budget,
      user_id: userId,
    });
    res.status(201).json({ id, name, budget });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a category
router.put("/:id", async (req, res) => {
  const userId = req.header("user-id");
  const { name, budget } = req.body;
  const { id } = req.params;
  if (!id || !name || !budget) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }
  try {
    const updated = await db("categories")
      .where({ id, user_id: userId })
      .update({ name, budget });
    if (updated === 0) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json({ id, name, budget });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a category
router.delete("/:id", async (req, res) => {
  const userId = req.header("user-id");
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }
  try {
    // Check if any transaction exists for this user in this category
    const transactionExists = await db("transactions")
      .where({ category_id: id, user_id: userId })
      .first();

    if (transactionExists) {
      res
        .status(405)
        .json({ error: "Cannot delete category with existing transactions" });
      return;
    }

    const deleted = await db("categories").where({ id, user_id: userId }).del();
    if (deleted === 0) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
