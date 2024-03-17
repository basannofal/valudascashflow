import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "cash_flow",

  // host: process.env.NEXT_PUBLIC_DB_HOST,
  // port: process.env.NEXT_PUBLIC_DB_PORT, // Typically 3306
  // user: process.env.NEXT_PUBLIC_DB_USER,
  // password: process.env.NEXT_PUBLIC_DB_PASSWORD,
  // database: process.env.NEXT_PUBLIC_DB_DATABASE,
});
const conn = pool.promise();

export default conn;
