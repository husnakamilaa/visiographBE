const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const anggotaController = require("../controllers/anggotaController");


router.post("/", anggotaController.createAnggota);
router.get("/", anggotaController.getAllAnggota);
router.get("/search", anggotaController.searchAnggota);
router.get("/:id", anggotaController.getAnggotaById);
router.put("/:id",  anggotaController.updateAnggota);
router.delete("/:id", anggotaController.deleteAnggota);

module.exports = router;
