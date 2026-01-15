require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const anggotaRoutes = require("./routes/anggotaRoutes");
const barangRoutes = require("./routes/barangRoutes");
const peminjamanRoutes = require("./routes/peminjamanRoutes");
const kerusakanRoutes = require("./routes/kerusakanRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Visiograph running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/anggota", anggotaRoutes);
app.use("/api/barang", barangRoutes);
app.use("/api/peminjaman", peminjamanRoutes);
app.use("/api/kerusakan", kerusakanRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});