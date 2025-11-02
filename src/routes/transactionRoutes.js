import express from "express";
import { 
    getTransactions, 
    createTransaction, 
    deleteTransactions, 
    getTransactionSummary 
} from "../controllers/transactionController.js";

const router = express.Router();

// Get transaction summary for a user (must come before /:user_id to avoid route conflict)
router.get("/summary/:user_id", getTransactionSummary);

// Get all transactions for a user
router.get("/:user_id", getTransactions);

// Create a new transaction
router.post("/", createTransaction);

// Delete transactions for a user
router.delete("/:user_id", deleteTransactions);

export default router;

