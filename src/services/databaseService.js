import { sql } from "../config/db.js";

// Initialize database tables
export const initDatabase = async () => {
    try {
        // Create transactions table
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2),   
            type VARCHAR(255),
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        
        console.log("✅ Transactions table created successfully");
        
        // You can add more tables here in the future
        // await createUsersTable();
        // await createCategoriesTable();
        
        return true;
    } catch (error) {
        console.error("❌ Error creating database tables:", error);
        throw error;
    }
};

// Create users table (for future use)
export const createUsersTable = async () => {
    try {
        await sql`CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        console.log("✅ Users table created successfully");
    } catch (error) {
        console.error("❌ Error creating users table:", error);
        throw error;
    }
};

// Create categories table (for future use)
export const createCategoriesTable = async () => {
    try {
        await sql`CREATE TABLE IF NOT EXISTS categories(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expenses')),
            user_id VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        console.log("✅ Categories table created successfully");
    } catch (error) {
        console.error("❌ Error creating categories table:", error);
        throw error;
    }
};

// Check database connection
export const checkDatabaseConnection = async () => {
    try {
        await sql`SELECT 1`;
        console.log("✅ Database connection successful");
        return true;
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        throw error;
    }
};

// Get database statistics
export const getDatabaseStats = async () => {
    try {
        const transactionCount = await sql`SELECT COUNT(*) as count FROM transactions`;
        const userCount = await sql`SELECT COUNT(DISTINCT user_id) as count FROM transactions`;
        
        return {
            totalTransactions: transactionCount[0].count,
            uniqueUsers: userCount[0].count
        };
    } catch (error) {
        console.error("❌ Error getting database stats:", error);
        throw error;
    }
}; 