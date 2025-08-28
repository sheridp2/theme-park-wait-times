const express = require("express");
const {
  addFavorite,
  getAllFavorite,
  getParkFavorite,
  deleteFavorite,
} = require("../controllers/favoriteControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add/:park", protect, addFavorite);
router.get("/getAll", protect, getAllFavorite);
router.get("/get/:park", protect, getParkFavorite);
router.delete("/delete/:park/:id", protect, deleteFavorite);

module.exports = router;
