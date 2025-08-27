const Trip = require("../models/Trip");

exports.addTrip = async (req, res) => {
  const userId = req.user.id;

  try {
    const { tripName, park, startDate, endDate } = req.body;

    if (!tripName || !park || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTrip = new Trip({
      userId,
      tripName,
      park,
      startDate,
      endDate,
    });

    await newTrip.save();
    res.status(200).json(newTrip);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTrip = async (req, res) => {
  const userId = req.user.id;

  try {
    const trips = await Trip.find({ userId }).sort({ date: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
