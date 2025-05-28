import { Router } from "express";
import db from "./db";

const router = Router();

// Get all transactions for a user
router.get("/", async (req, res) => {
  const userId = req.header("user-id");
  try {
    const transactions = await db("transactions").where({ user_id: userId });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new transaction
router.post("/", async (req, res) => {
  const userId = req.header("user-id");
  const { amount, date, category_id, description } = req.body;
  if (!amount || !date || !category_id) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    const category = await db("categories").where({ id: category_id }).first();
    if (!category) {
      res.status(400).json({ error: "Invalid category_id" });
      return;
    }

    const [id] = await db("transactions").insert({
      amount,
      date,
      category_id,
      description,
      user_id: userId,
    });
    res.status(201).json({ id, amount, date, category_id, description });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a transaction
router.put("/:id", async (req, res) => {
  const userId = req.header("user-id");
  const { amount, date, category_id, description } = req.body;
  const { id } = req.params;
  if (!id || !amount || !date || !category_id) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    const category = await db("categories").where({ id: category_id }).first();
    if (!category) {
      res.status(400).json({ error: "Invalid category_id" });
      return;
    }

    const updated = await db("transactions")
      .where({ id, user_id: userId })
      .update({ amount, date, category_id, description });

    if (updated === 0) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    res.status(200).json({ id, amount, date, category_id, description });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a transaction
router.delete("/:id", async (req, res) => {
  const userId = req.header("user-id");
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    const deleted = await db("transactions")
      .where({ id, user_id: userId })
      .del();

    if (deleted === 0) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
