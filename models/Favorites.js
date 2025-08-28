const mongoose = require("mongoose");

const FavoritesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: "true",
    },
    park: { type: String, required: true },
    favorites: {
      type: [
        {
          rideId: { type: String, required: true },
          rideName: { type: String, required: true }
        }
      ],
      validate: [
        {
          validator: function(arr) {
            const ids = arr.map(fav => fav.rideId);
            return ids.length === new Set(ids).size;
          },
          message: 'Duplicate rideId found in favorites'
        },
        {
          validator: function(arr) {
            return arr.length <= 5;
          },
          message: 'Favorites exceeds the limit of 5'
        }
      ]
    },
  },
  { timestamps: true }
);

FavoritesSchema.index({ userId: 1, park: 1 }, { unique: true });

module.exports = mongoose.model("Favorites", FavoritesSchema);
