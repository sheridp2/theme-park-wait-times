require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./models/WaitTimes");
const connectDB = require("./config/db");
const app = express();

const Themeparks = require("themeparks");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methhods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

connectDB();

require("./routes/waitTimesRoutes")(app);

function sortRides(key) {
  return function (a, b) {
    return a[key].replace(/\W/g, "").localeCompare(b[key].replace(/\W/g, ""));
  };
}



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
