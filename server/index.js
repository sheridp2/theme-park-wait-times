const express = require("express");
const Themeparks = require("themeparks");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { MONGODB_KEY } = require("./config/keys");
const moment = require("moment");

const DisneyWorldMagicKingdom =
  new Themeparks.Parks.WaltDisneyWorldMagicKingdom();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

//DB start
const uri = MONGODB_KEY;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run(collectionName) {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("parks").collection(collectionName);
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

async function add(collectionName, data) {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    console.log("Connected successfully to server " + collectionName);
    const result = await client
      .db("Parks")
      .collection(collectionName)
      .insertMany(data, (checkKeys = false));
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run("Magic_Kingdom").catch(console.dir);
//DB End

function filterRides(responseData) {
  let filteredArray = [];

  for (let i = 0; i < responseData.length; i++) {
    responseData[i].name = responseData[i].name
      .replace(" - Temporarily Unavailable", "")
      .trim();
    responseData[i].name = responseData[i].name.replace("®", "");
    responseData[i].name = responseData[i].name.replace("*", "");
    responseData[i].name = responseData[i].name.replace("™", "");
    {
      filteredArray.push(responseData[i]);
    }
  }
  return filteredArray;
}

function sortRides(key) {
  return function (a, b) {
    return a[key].replace(/\W/g, "").localeCompare(b[key].replace(/\W/g, ""));
  };
}

app.get("/disneyworld-magickingdom-parkhours", (req, res) => {
  DisneyWorldMagicKingdom.GetOpeningTimes().then((parkHours) => {
    res.send(parkHours);
    console.log(parkHours);
  });
});

app.get("/disneyworld-magickingdom-waittimes", (req, res) => {
  DisneyWorldMagicKingdom.GetWaitTimes()
    .then((rideData) => {
      return filterRides(rideData);
    })
    .then((rideData) => {
      res.send(rideData);
      var d = new Date();
      var myTimezone = "America/Toronto";
      var myDatetimeFormat = "YYYY-MM-DD hh:mm:ss a z";
      var myDatetimeString = moment(d).tz(myTimezone).format(myDatetimeFormat);

      let temp = [
        {
          date: myDatetimeString,
          rides: [],
        },
      ];

      for (let i = 0; i < rideData.length; i++) {
        let rideName = rideData[i].name.split(".").join("&#46;");
        let rideWait = rideData[i].waitTime;
        temp[0].rides.push({ [rideName]: rideWait });
      }
      console.log(temp);
      add("Magic_Kingdom_Test", temp);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(port);
