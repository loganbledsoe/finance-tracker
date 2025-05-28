import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import categoriesRouter from "./routes.categories";
import transactionsRouter from "./routes.transactions";
import db from "./db";

const app = express();
const PORT = process.env.PORT;

import cors from "cors";
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use(express.json());

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }
  next(err);
});

// To be replaced with proper authentication
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.header("user-id");
  if (!userId) {
    res.status(401).json({ error: "Missing user-id header" });
    return;
  }

  const user = await db("users").where({ id: userId }).first();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  next();
});

app.use("/categories", categoriesRouter);
app.use("/transactions", transactionsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
