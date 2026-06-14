import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const query = async (text: string, params?: any[]): Promise<any[]> => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows;
    } catch (err) {
        console.error("Database Error:", err);
        throw err;
    } finally {
        client.release();
    }
};
