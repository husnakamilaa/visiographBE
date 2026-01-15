const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const anggotaController = require("../controllers/anggotaController");


router.post("/", authMiddleware, anggotaController.createAnggota);
router.get("/", authMiddleware, anggotaController.getAllAnggota);
router.get("/search", authMiddleware, anggotaController.searchAnggota);
router.get("/:id", authMiddleware, anggotaController.getAnggotaById);
router.put("/:id", authMiddleware, anggotaController.updateAnggota);
router.delete("/:id", authMiddleware, anggotaController.deleteAnggota);

module.exports = router;
