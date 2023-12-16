const mysqldump = require("mysqldump");

export default async (req, res) => {
  try {
    const backupData = await mysqldump({
      connection: {
        host: "localhost",
        user: "root",
        password: "",
        database: "cash_flow",
      },
    });

    // Instead of saving to a file, you can send the backup data as a response
    res.status(200).json({ success: true, backupData });
  } catch (error) {
    console.error("Backup failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
