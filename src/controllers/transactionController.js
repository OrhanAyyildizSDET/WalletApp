import { sql } from "../config/db.js";

// Get all transactions for a user
export const getTransactions = async (req, res) => {
    try {
        const { userId  } = req.params;
        console.log("Backend received userId:", userId); // Debug log
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId }`;
        console.log("DB result:", transactions); // Debug log
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
};

// Create a new transaction
export const createTransaction = async (req, res) => {
    const { user_id, title, category, amount, type } = req.body;
    try {
        // Check if all required fields are present
        if (!title || !category || !user_id) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const transaction = await sql`
            INSERT INTO transactions (user_id, title, category, amount, type) 
            VALUES (${user_id}, ${title}, ${category}, ${amount}, ${type})
            RETURNING *
        `;
        
        res.status(201).json({ 
            message: "Transaction created successfully", 
            transaction: transaction[0] 
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating transaction", error: error.message });
    }
};

// Delete transactions for a user
export const deleteTransactions = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user_id is present and valid
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ message: "User ID must be a number string" });
        }
        
        const transaction = await sql`DELETE FROM transactions WHERE user_id = ${id} RETURNING *`;
        
        if (transaction.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        
        res.status(200).json({ 
            message: "Transaction deleted successfully", 
            transaction 
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error: error.message });
    }
};

// Get transaction summary for a user
export const getTransactionSummary = async (req, res) => {
    try {
        const { userId  } = req.params;
        
        // if (!/^\d+$/.test(userId )) {
        //     return res.status(400).json({ message: "User ID must be a number string" });
        // }
        
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance 
            FROM transactions 
            WHERE user_id = ${userId }
        `;
        
        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income 
            FROM transactions 
            WHERE user_id = ${userId } and amount > 0
        `;
        
        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expenses
            FROM transactions
            WHERE user_id = ${userId } and amount < 0
        `;
        
        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expenseResult[0].expenses
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction summary", error: error.message });
    }
}; 