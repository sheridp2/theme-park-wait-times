const mongoose = require("mongoose");

const ParkFavoritesSchema = new mongoose.Schema({
  park: { type: String, required: true },
  favorites: [
    {
      rideId: { type: String, required: true },
      rideName: { type: String, required: true }
    }
  ]
});

const FavoritesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parks: [ParkFavoritesSchema]
  },
  { timestamps: true }
);

FavoritesSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Favorites", FavoritesSchema);
