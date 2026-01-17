const db = require("../config/database");

exports.createKerusakan = (req, res) => {
  const { id_barang, deskripsi, jumlah, tanggal, status_perbaikan } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: "Gagal memulai transaksi", error: err });

    const sqlInsert = `
      INSERT INTO kerusakan (id_barang, deskripsi, jumlah, tanggal, status_perbaikan) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sqlInsert, [id_barang, deskripsi, jumlah, tanggal, status_perbaikan], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: "Gagal simpan data kerusakan", error: err });
        });
      }
    
      const sqlUpdateStok = `
        UPDATE barang 
        SET jumlah_total = jumlah_total - ? 
        WHERE id = ?
      `;

      db.query(sqlUpdateStok, [jumlah, id_barang], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: "Gagal update stok barang", error: err });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => res.status(500).json(err));
          }
          res.status(201).json({ message: "Data kerusakan berhasil ditambah & stok barang berkurang" });
        });
      });
    });
  });
};

exports.getAllKerusakan = (req, res) => {
  const sql = `
    SELECT k.*, b.nama AS nama_barang
    FROM kerusakan k
    JOIN barang b ON k.id_barang = b.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};

exports.getKerusakanById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT k.*, b.nama AS nama_barang
    FROM kerusakan k
    JOIN barang b ON k.id_barang = b.id
    WHERE k.id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({
        message: "Data kerusakan tidak ditemukan"
      });
    }

    res.json(results[0]);
  });
};


exports.updateKerusakan = (req, res) => {
  const { id } = req.params;
  const { id_barang, jumlah, status_perbaikan } = req.body;

  const sqlGetOld = "SELECT status_perbaikan FROM kerusakan WHERE id = ?";
  db.query(sqlGetOld, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    const statusLama = results[0].status_perbaikan;

    db.beginTransaction((err) => {
      const sqlUpdate = `UPDATE kerusakan SET id_barang=?, deskripsi=?, jumlah=?, tanggal=?, status_perbaikan=? WHERE id = ?`;
      db.query(sqlUpdate, [id_barang, req.body.deskripsi, jumlah, req.body.tanggal, status_perbaikan, id], (err) => {
        if (err) return db.rollback(() => res.status(500).json(err));

        if (statusLama === 'Belum' && status_perbaikan === 'Sudah') {
          const sqlAddStok = "UPDATE barang SET jumlah_total = jumlah_total + ? WHERE id = ?";
          db.query(sqlAddStok, [jumlah, id_barang], (err) => {
            if (err) return db.rollback(() => res.status(500).json(err));
            db.commit(() => res.json({ message: "Data update & stok dikembalikan" }));
          });
        } else {
          db.commit(() => res.json({ message: "Data kerusakan berhasil diupdate" }));
        }
      });
    });
  });
};

exports.deleteKerusakan = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM kerusakan WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Data kerusakan berhasil dihapus" });
  });
};
