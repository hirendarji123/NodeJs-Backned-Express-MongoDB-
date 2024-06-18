// backend/routes/comboRoutes.js
const express = require("express");
const {
  getCombos,
  getComboById,
  createCombo,
  updateCombo,
  deleteCombo,
} = require("../controllers/comboController");

const router = express.Router();

router.get("/", getCombos);
router.get("/:id", getComboById);
router.post("/", createCombo);
router.put("/:id", updateCombo);
router.delete("/:id", deleteCombo);

module.exports = router;
