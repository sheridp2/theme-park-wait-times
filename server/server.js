const express = require("express");
const Themeparks = require("themeparks");
const cors = require("cors");

const DisneyWorldMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

function filterRides(responseData, index) {
  let filteredArray = [];
  for (let i = 0; i < responseData.length; i++) {
    responseData[i].name = responseData[i].name
      .replace(" - Temporarily Unavailable", "")
      .trim();
    responseData[i].name = responseData[i].name.replace("®", "");
    responseData[i].name = responseData[i].name.replace("*", "");
    responseData[i].name = responseData[i].name.replace("™", "");
    if (responseData[i].name == "Soarin' Over California") {
      responseData[i].name = "Soarin' Around the World";
    }
    // if (
    //   !allRidesToRemove[index].includes(
    //     responseData[i].name.replace(" - Temporarily Unavailable", "").trim()
    //   )
    // )
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

app.get("/disneyworld-magickingdom-waittimes", (req, res) => {
  DisneyWorldMagicKingdom.GetWaitTimes()
    .then((rideData) => {
      return filterRides(rideData, 5);
    })
    .then((rideData) => {
      return rideData.sort(sortRides("name"));
    })
    .then((rideData) => {
      res.send(rideData);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(port);
