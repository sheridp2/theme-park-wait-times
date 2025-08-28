const Favorites = require("../models/Favorites");

exports.addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { park } = req.params;
  const { rideId, rideName } = req.body;

  try {
    let parkFavorites = await Favorites.findOne({ userId, park });

    if (!parkFavorites) {
      parkFavorites = new Favorites({
        userId,
        park,
        favorites: [],
      });
    }

    parkFavorites.favorites.push({ rideId, rideName });
    await parkFavorites.save();

    res.status(200).json(parkFavorites);
  } catch (error) {
    console.error("Error adding favorite:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
}


exports.getAllFavorite = async (req, res) => {
  const userId = req.user.id;

  try {
    const favorites = await Favorites.find({ userId });
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.getParkFavorite = async (req, res) => {
  const userId = req.user.id;
  const { park } = req.params;

  try {
    const parkFavorites = await Favorites.findOne({ userId, park });
    res.status(200).json(parkFavorites);
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
