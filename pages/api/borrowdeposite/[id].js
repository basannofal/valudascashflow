// api/category/[id].js

import conn from "../dbconfig/conn";

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  if (req.method === "GET") {
    try {
      const q =
        "SELECT *, DATE_FORMAT(date, '%d-%m-%Y') as date FROM cf_deposit_borrowed_payment WHERE m_id = ? order by id desc";
      const [rows] = await conn.query(q, [id]);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({
        error: 1,
        msg: "Deposite Payment Cannot Fetch... Check Connection",
      });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method == "DELETE") {
    try {
      const { id } = req.query;

      // Query the database
      const q = "DELETE FROM cf_deposit_borrowed_payment WHERE id = ?";

      const [rows] = await conn.query(q, [id]);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      if (error.toString().includes("Cannot delete or update a parent row")) {
        res.status(500).json({
          error: 1,
          msg: "Deposite Payment Not Deleted... Already Use In Any Payment",
        });
      } else {
        res.status(500).json({
          error: 1,
          msg: "Deposite Payment Cannot Delete... Check Connection",
        });
      }
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method == "PATCH") {
    const {
      amount,
      collectedby,
      dipositeby,
      mobileno,
      mid,
      date,
      note,
      username,
    } = req.body;
    try {
      // Query the database
      const q =
        "UPDATE `cf_deposit_borrowed_payment` SET `amount`= ?, `deposite_by`= ?, `mobile_no`= ?, `collected_by`= ?, `collected_user`= ?, `date`= ?, `note`= ?, `m_id`= ?  WHERE id = ?";
      const data = [
        amount,
        dipositeby,
        mobileno,
        collectedby,
        username,
        date,
        note,
        mid,
        id,
      ];
      const [rows] = await conn.query(q, data);
      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({
        error: 1,
        msg: "Deposite Payment Cannot Update... Check Connection",
      });
    } finally {
      conn.releaseConnection();
    }
  }
}
