const express = require("express");

const cors = require("cors");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/keys");

require("./models/WaitTimes");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
// app.use(cors());

require("./routes/waitTimesRoutes")(app);

//DB start
const uri = mongoURI;

function sortRides(key) {
  return function (a, b) {
    return a[key].replace(/\W/g, "").localeCompare(b[key].replace(/\W/g, ""));
  };
}

app.get("/disneyworld-magickingdom-parkhours", (req, res) => {
  DisneyWorldMagicKingdom.GetOpeningTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

app.listen(port);
