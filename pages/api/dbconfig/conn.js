import mysql from "mysql2/promise";

let pool;

const createPool = () => {
  return mysql.createPool({
    host: "tailorg.com",
    port: 3306, // Default port
    user: "tailorg_cashflow",
    password: "tailorg_cashflow",
    database: "tailorg_cashflow",

    // Connection pool settings
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on your needs
    queueLimit: 0, // Unlimited queue length
    acquireTimeout: 10000, // 10 seconds timeout for acquiring a connection
    idleTimeout: 10000 // 10 seconds for idle connections
  });
};

const getPool = () => {
  if (!pool) {
    pool = createPool();
  }
  return pool;
};

// Export the connection pool
const conn = getPool();

export default conn;

// Function to test the connection
export const testConnection = async () => {
  try {
    const connection = await conn.getConnection();
    console.log("Connected to the database!");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
