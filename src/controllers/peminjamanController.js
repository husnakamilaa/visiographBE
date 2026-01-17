const db = require("../config/database");

/**
 * CREATE peminjaman
 */
exports.createPeminjaman = (req, res) => {
  const {
    id_barang,
    id_anggota,
    tanggal_pinjam,
    tanggal_kembali,
    jumlah_pinjam,
    status_pinjam
  } = req.body;

  // 1. CEK STOK BARANG DULU KIDSZ //////////////////////////////////////////////////////////////////////////////////////////
  const sqlCheckStok = "SELECT nama, jumlah_total FROM barang WHERE id = ?";
  
  db.query(sqlCheckStok, [id_barang], (err, results) => {
    if (err) return res.status(500).json({ message: "Error saat cek stok", error: err.message });
    
    if (results.length === 0) return res.status(404).json({ message: "Barang tidak ditemukan" });

    const barang = results[0];
    
    if (barang.jumlah_total < jumlah_pinjam) { // stok hrs lbh banyak
      return res.status(400).json({ 
        message: `Stok tidak mencukupi! ${barang.nama} sisa ${barang.jumlah_total}` 
      });
    }

    // 2. BARU INSERT /////////////////////////////////////////////////////////////////////////////////
    const sqlInsert = `
      INSERT INTO peminjaman
      (id_barang, id_anggota, tanggal_pinjam, tanggal_kembali, jumlah_pinjam, status_pinjam)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sqlInsert,
      [id_barang, id_anggota, tanggal_pinjam, tanggal_kembali, jumlah_pinjam, status_pinjam],
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Gagal menambah peminjaman", error: err.message });
        }

        // 3. UPDATE STOK DI TABEL BARANG (KURANGI STOK) ///////////////////////////////////////////////////////////
        const sqlUpdateStok = "UPDATE barang SET jumlah_total = jumlah_total - ? WHERE id = ?";
        
        db.query(sqlUpdateStok, [jumlah_pinjam, id_barang], (updateErr) => {
          if (updateErr) {
            console.error("Gagal update stok:", updateErr.message);
          }

          res.status(201).json({
            message: "Peminjaman berhasil ditambahkan dan stok barang diperbarui"
          });
        });
      }
    );
  });
};

/**
 * READ semua peminjaman (JOIN)
 */
exports.getAllPeminjaman = (req, res) => {
  const sql = `
    SELECT p.*, a.nama AS nama_anggota, b.nama AS nama_barang
    FROM peminjaman p
    JOIN anggota a ON p.id_anggota = a.id
    JOIN barang b ON p.id_barang = b.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};

/**
 * GET peminjaman by ID
 */
exports.getPeminjamanById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM peminjaman WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({
        message: "Peminjaman tidak ditemukan"
      });
    }

    res.json(results[0]);
  });
};

/**
 * UPDATE peminjaman
 */
exports.updatePeminjaman = (req, res) => {
  const { id } = req.params;
  const {
    id_barang,
    id_anggota,
    tanggal_pinjam,
    tanggal_kembali,
    jumlah_pinjam,
    status_pinjam
  } = req.body;

  const sql = `
    UPDATE peminjaman
    SET id_barang=?, id_anggota=?, tanggal_pinjam=?, tanggal_kembali=?,
        jumlah_pinjam=?, status_pinjam=?
    WHERE id = ?
  `;

  db.query(
    sql,
    [id_barang, id_anggota, tanggal_pinjam, tanggal_kembali, jumlah_pinjam, status_pinjam, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Data peminjaman berhasil diupdate" });
    }
  );
};

/**
 * DELETE peminjaman
 */
exports.deletePeminjaman = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM peminjaman WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Data peminjaman berhasil dihapus" });
  });
};
