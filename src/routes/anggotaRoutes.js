const express = require("express");
const router = express.Router();
const anggotaController = require("../controllers/anggotaController");

// CREATE
router.post("/", anggotaController.createAnggota);

// READ
router.get("/", anggotaController.getAllAnggota);

// SEARCH
router.get("/search", anggotaController.searchAnggota);

// GET by ID
router.get("/:id", anggotaController.getAnggotaById);

// UPDATE
router.put("/:id", anggotaController.updateAnggota);

// DELETE
router.delete("/:id", anggotaController.deleteAnggota);

module.exports = router;
