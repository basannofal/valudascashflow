import conn from "../dbconfig/conn";

export default async function handler(req, res) {

  if (req.method == "POST") {

    console.log("console.log ",req.body);
    const {
      amount,
      collectedby,
      date,
      note,
      mid,
      bailmid,
      bailmid2,
      username,
    } = req.body;
    try {
      // Query the database
      const q =
        "INSERT INTO `cf_borrow_payment`(`amount`, `date`, `note`, `m_id`, `bail_m_id`, `bail_m_id2`, `given_by`, `given_user`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

      const data = [
        amount,
        date,
        note,
        mid,
        bailmid,
        bailmid2,
        collectedby,
        username,
      ];
      const [rows] = await conn.query(q, data);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({
        error: 1,
        msg: "Borrow Payment Cannot Fetch... Check Connection",
      });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method == "GET") {
    try {
      // Query the database

      const q =
        "SELECT mb.*,DATE_FORMAT(mb.date, '%d-%m-%Y') as date,  mm.fname, mm.mname, mm.lname, mm.nickname, mm.address, mm.mobile_no, mm.alt_mobile_no, mm.email, mm.aadhar_card, mm.bank_ac, mm.ifsc, mm.add_by,  mm.date as member_date, mm.update_by as member_updated_by, mm.update_date as member_updated_date, bm.fname AS bail_fname, bm.mname AS bail_mname, bm.lname AS bail_lname  FROM cf_borrow_payment AS mb JOIN cf_member_master AS mm ON mb.m_id = mm.id LEFT JOIN cf_member_master AS bm ON mb.bail_m_id = bm.id order by mb.id desc";

      const [rows] = await conn.query(q);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({
        error: 1,
        msg: "Borrow Payment Cannot Added... Check Connection",
      });
    } finally {
      conn.releaseConnection();
    }
  }
}
