const express = require("express");
const {
  addTrip,
  getAllTrip,
  deleteTrip,
} = require("../controllers/tripControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addTrip);
router.get("/getAll", protect, getAllTrip);
router.delete("/delete/:id", protect, deleteTrip);

module.exports = router;
