const express = require("express");
const Themeparks = require("themeparks");

const router = express.Router();

const DisneyWorldMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
const DisneyEpcot = new Themeparks.Parks.WaltDisneyWorldEpcot();
const DisneyAnimalKingdom = new Themeparks.Parks.WaltDisneyWorldAnimalKingdom();
const DisneyHollywoodStudios = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios();
const DisneyDisneyland = new Themeparks.Parks.DisneylandResortMagicKingdom();

router.get("/magickingdom-waittimes", async (req, res) => {
  DisneyWorldMagicKingdom.GetWaitTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

router.get("/magickingdom-parkhours", (req, res) => {
  DisneyWorldMagicKingdom.GetOpeningTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

router.get("/epcot-waittimes", async (req, res) => {
  DisneyEpcot.GetWaitTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

router.get("/epcot-parkhours", (req, res) => {
  DisneyEpcot.GetOpeningTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

router.get("/animalkingdom-waittimes", async (req, res) => {
  DisneyAnimalKingdom.GetWaitTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

router.get("/animalkingdom-parkhours", (req, res) => {
  DisneyAnimalKingdom.GetOpeningTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

router.get("/hollywoodstudios-waittimes", async (req, res) => {
  DisneyHollywoodStudios.GetWaitTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

router.get("/hollywoodstudios-parkhours", (req, res) => {
  DisneyHollywoodStudios.GetOpeningTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

router.get("/disneyland-waittimes", async (req, res) => {
  DisneyDisneyland.GetWaitTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

router.get("/disneyland-parkhours", (req, res) => {
  DisneyDisneyland.GetOpeningTimes().then((parkHours) => {
    res.send(parkHours);
  });
});

module.exports = router;
