// server code
import conn from "../dbconfig/conn";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { username, password } = req.body;
    try {
      // Query the database with username and password
      const [rows] = await conn.query(
        "select * from cf_auth_info where username = ? and password = ?",
        [username, password]
      );

      if (rows.length > 0) {
        // User is authenticated, send the response
        res.status(200).json(rows[0]);
      } else {
        // User not found or credentials are incorrect
        res.status(401).json({ error: "Invalid username or password" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to authenticate user" });
    } finally {
      conn.releaseConnection();
    }
  }
}
