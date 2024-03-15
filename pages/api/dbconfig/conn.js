import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  // port: 'YOUR_MYSQL_PORT', // Typically 3306
  // user: "root",
  // password: "",
  // database: "cash_flow",
  // waitForConnections: true,
  // max_connections: 150, // Set the maximum number of connections

  // host: "aufcart.com",
  // // port: '3306', // Typically 3306
  // user: "valudaaa_cash_flow",
  // password: "iXR%suDt).BI",
  // database: "valudaaa_cash_flow",

  host: "codinghelps.com",
  // port: '3306', // Typically 3306
  user: "codinghelps_cash_flow",
  password: "isd)t-HEq&E!",
  database: "codinghelps_cash_flow",
});
const conn = pool.promise();

export default conn;
