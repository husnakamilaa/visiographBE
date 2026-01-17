const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const kerusakanController = require("../controllers/kerusakanController");

router.post("/", kerusakanController.createKerusakan);
router.get("/", kerusakanController.getAllKerusakan);
router.get("/:id", kerusakanController.getKerusakanById);
router.put("/:id", kerusakanController.updateKerusakan);
router.delete("/:id", kerusakanController.deleteKerusakan);

module.exports = router;