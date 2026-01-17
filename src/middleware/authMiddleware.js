const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
      code: "NO_TOKEN"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Simpan data user di req agar bisa dipakai di controller lain
    next();
} catch (err) {
    return res.status(401).json({
        message: "Sesi habis, silakan login kembali",
        code: "INVALID_TOKEN"
    });
}
};
