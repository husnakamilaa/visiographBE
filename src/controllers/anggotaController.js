const db = require("../config/database");

/**
 * CREATE anggota
 */
exports.createAnggota = (req, res) => {
  const { nama, nim, divisi } = req.body;

  const sql = "INSERT INTO anggota (nama, nim, divisi) VALUES (?, ?, ?)";
  db.query(sql, [nama, nim, divisi], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal menambah anggota",
        error: err.message
      });
    }

    res.status(201).json({
      message: "Anggota berhasil ditambahkan"
    });
  });
};

/**
 * READ semua anggota
 */
exports.getAllAnggota = (req, res) => {
  const sql = "SELECT * FROM anggota";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

/**
 * SEARCH anggota berdasarkan nama
 */
exports.searchAnggota = (req, res) => {
  const { nama } = req.query;

  const sql = "SELECT * FROM anggota WHERE nama LIKE ?";
  db.query(sql, [`%${nama}%`], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

/**
 * GET anggota berdasarkan ID
 */
exports.getAnggotaById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM anggota WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Anggota tidak ditemukan"
      });
    }

    res.json(results[0]);
  });
};

/**
 * UPDATE anggota
 */
exports.updateAnggota = (req, res) => {
  const { id } = req.params;
  const { nama, nim, divisi } = req.body;

  const sql = `
    UPDATE anggota 
    SET nama = ?, nim = ?, divisi = ?
    WHERE id = ?
  `;

  db.query(sql, [nama, nim, divisi, id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Data anggota berhasil diupdate" });
  });
};

/**
 * DELETE anggota
 */
exports.deleteAnggota = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM anggota WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Data anggota berhasil dihapus" });
  });
};
