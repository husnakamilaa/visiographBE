const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const peminjamanController = require("../controllers/peminjamanController");

router.post("/", authMiddleware, peminjamanController.createPeminjaman);
router.get("/", authMiddleware, peminjamanController.getAllPeminjaman);
router.get("/:id", authMiddleware, peminjamanController.getPeminjamanById);
router.put("/:id", authMiddleware, peminjamanController.updatePeminjaman);
router.delete("/:id", authMiddleware, peminjamanController.deletePeminjaman);

module.exports = router;
