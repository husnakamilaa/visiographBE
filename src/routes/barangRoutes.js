const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const barangController = require("../controllers/barangController");

router.post("/", barangController.createBarang);
router.get("/", barangController.getAllBarang);
router.get("/search", barangController.searchBarang);
router.get("/:id", barangController.getBarangById);
router.put("/:id", barangController.updateBarang);
router.delete("/:id", barangController.deleteBarang);

module.exports = router;
