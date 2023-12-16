import conn from "../dbconfig/conn";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { name, number, email, username, password, isAdmin } = req.body;
    try {
      // Query the database
      const q =
        "INSERT INTO `cf_auth_info`(`name`, `number`, `email`, `username`, `password`, `is_admin`) VALUES ( ?, ?, ?, ?, ?, ?)";

      const data = [name, number, email, username, password, isAdmin];
      const [rows] = await conn.query(q, data);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ error: 1, msg: "User Cannot Fetch... Check Connection" });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method == "GET") {
    try {
      // Query the database
      const q = "SELECT * FROM cf_auth_info";

      const [rows] = await conn.query(q);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ error: 1, msg: "User Cannot Fetch... Check Connection" });
    } finally {
      conn.releaseConnection();
    }
  }
}
