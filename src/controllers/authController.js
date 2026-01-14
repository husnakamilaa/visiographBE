const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { username, password } = req.body;

  // validasi input kosong
  if (!username || !password) {
    return res.status(400).json({
      message: "Username dan password wajib diisi",
      code: "EMPTY_FIELD"
    });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Server error",
        code: "SERVER_ERROR"
      });
    }

    // ❌ username salah
    if (results.length === 0) {
      return res.status(404).json({
        message: "Username tidak ditemukan",
        code: "USERNAME_NOT_FOUND"
      });
    }

    const user = results[0];

    // ❌ password salah
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Password salah",
        code: "WRONG_PASSWORD"
      });
    }

    // ✅ login sukses
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(200).json({
      message: "Login berhasil",
      token: token
    });
  });
};
