const mongoose = require("mongoose");
const Themeparks = require("themeparks");

const waitTimes = mongoose.model("waitTimes");

module.exports = (app) => {
  const DisneyWorldMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
  const DisneyEpcot = new Themeparks.Parks.WaltDisneyWorldEpcot();

  app.get("/disneyworld-magickingdom-waittimes", async (req, res) => {
    DisneyWorldMagicKingdom.GetWaitTimes().then((parkHours) => {
      res.send(parkHours);
    });
  });

  app.get("/disneyworld-magickingdom-parkhours", (req, res) => {
    DisneyWorldMagicKingdom.GetOpeningTimes().then((parkHours) => {
      res.send(parkHours);
    });
  });

  app.get("/disneyworld-epcot-waittimes", async (req, res) => {
    DisneyEpcot.GetWaitTimes().then((parkHours) => {
      res.send(parkHours);
    });
  });

  app.get("/disneyworld-epcot-parkhours", (req, res) => {
    DisneyEpcot.GetOpeningTimes().then((parkHours) => {
      res.send(parkHours);
    });
  });

  // app.get("/disneyworld-magickingdom-waittimes/:date", async (req, res) => {
  //   async function search(date) {
  //     const query = { todaysDate: date };
  //     const returnedData = await waitTimes.findOne(query);
  //     if (!returnedData) {
  //       addDay();
  //     } else {
  //       DisneyWorldMagicKingdom.GetWaitTimes().then((rideData) => {
  //         let dateAndTime = new Date();
  //         let currentTime = dateAndTime.toLocaleTimeString();

  //         for (let i = 0; i < rideData.length; i++) {
  //           let rideName = rideData[i].name.split(".").join("&#46;");
  //           let rideWait = rideData[i].waitTime;
  //           returnedData.currentWaitTimes[rideName].push({
  //             [currentTime]: rideWait,
  //           });
  //         }
  //         async function updateTime() {
  //           await waitTimes.findOneAndUpdate(
  //             { todaysDate: date },
  //             { currentWaitTimes: returnedData.currentWaitTimes },
  //             { useFindAndModify: false }
  //           );
  //           const query = { todaysDate: date };
  //           const refreshedData = await waitTimes.findOne(query);
  //           res.send(refreshedData);
  //         }
  //         updateTime();
  //       });
  //     }
  //   }

  //   async function addDay() {
  //     DisneyWorldMagicKingdom.GetWaitTimes()
  //       .then((rideData) => {
  //         return filterRides(rideData);
  //       })
  //       .then((rideData) => {
  //         let temp = {};

  //         let dateAndTime = new Date();
  //         let currentTime = dateAndTime.toLocaleTimeString();
  //         let dateToday = dateAndTime.toLocaleDateString().replace(/\//g, "-");
  //         for (let i = 0; i < rideData.length; i++) {
  //           let rideName = rideData[i].name.split(".").join("&#46;");
  //           let rideWait = rideData[i].waitTime;
  //           temp[rideName] = [{ [currentTime]: rideWait }];
  //         }
  //         const waittimes = new waitTimes({
  //           todaysDate: dateToday,
  //           currentWaitTimes: temp,
  //         });
  //         try {
  //           waittimes.save();
  //           console.log(waittimes);
  //           res.send(waittimes);
  //         } catch (err) {
  //           res.send(400, err);
  //         }
  //       });
  //   }

  //   try {
  //     search(req.params.date);
  //   } catch (err) {
  //     res.send(400, err);
  //   }
  // });
};

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
