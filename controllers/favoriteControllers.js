const Favorites = require("../models/Favorites");

exports.addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { park } = req.params;
  const { rideId, rideName } = req.body;

  try {
    let userFavorites = await Favorites.findOne({ userId });

    if (!userFavorites) {
      // Create new document if user has no favorites yet
      userFavorites = new Favorites({
        userId,
        parks: [{ park, favorites: [{ rideId, rideName }] }],
      });
    } else {
      // Find the park entry
      let parkEntry = userFavorites.parks.find((p) => p.park === park);

      if (!parkEntry) {
        // Add new park entry
        userFavorites.parks.push({ park, favorites: [{ rideId, rideName }] });
      } else {
        // Prevent duplicates and limit to 5
        if (parkEntry.favorites.length >= 5) {
          return res
            .status(400)
            .json({ message: "Favorites limit reached for this park." });
        }
        if (parkEntry.favorites.some((fav) => fav.rideId === rideId)) {
          return res.status(400).json({ message: "Ride already in favorites." });
        }
        parkEntry.favorites.push({ rideId, rideName });
      }
    }

    await userFavorites.save();
    res.status(200).json(userFavorites);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFavorite = async (req, res) => {
  const userId = req.user.id;

  try {
    const favorites = await Favorites.find({ userId });
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getParkFavorite = async (req, res) => {
  const userId = req.user.id;
  const { park } = req.params;

  try {
    const userFavorites = await Favorites.findOne({ userId });
    if (!userFavorites)
      return res.status(404).json({ message: "No favorites found." });

    const parkEntry = userFavorites.parks.find((p) => p.park === park);
    if (!parkEntry)
      return res.status(404).json({ message: "No favorites for this park." });

    res.status(200).json(parkEntry.favorites);
  } catch (error) {
    console.error("Error fetching park favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFavorite = async (req, res) => {
  const userId = req.user.id;
  const { park, id } = req.params;

  try {
    const deletedFavorite = await Favorites.findOneAndUpdate(
      { userId, park, "favorites._id": id },
      { $pull: { favorites: { _id: id } } },
      { new: true }
    );

    if (!deletedFavorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json(deletedFavorite);
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
};
