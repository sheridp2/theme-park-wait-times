import React, { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { rideImages, rideMP4 } from "./rideImages";

const useStyles = makeStyles((theme) => ({
  header: {
    minHeight: 70,
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 2,
    },
  },
  media: {
    height: 0,
    minWidth: 345,
    paddingTop: "56.25%", // 16:9
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  media_mp4: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  avatar: {
    backgroundColor: "#113CCF",
  },
  footer: {
    paddingTop: "0",
  },
}));

function Parks() {
  const classes = useStyles();
  const [parkData, setParkData] = useState([]);
  const [operatingRides, setOperatingRides] = useState([]);
  const [closedRides, setClosedRides] = useState([]);
  const [parkHours, setParkHours] = useState([]);
  const [openingTime, setOpeningTime] = useState([]);
  const [closingTime, setClosingTime] = useState([]);

  useEffect(() => {
    const closedRidesArray = [];
    const operatingRidesArray = [];
    axios
      .get("http://localhost:3001/disneyworld-magickingdom-waittimes")
      .then((res) => {
        res.data.forEach((ride) => {
          if (ride.waitTime === null) {
            ride.waitTime = 0;
          }
          if (ride.status === "Refurbishment" || ride.status === "Closed") {
            closedRidesArray.push(ride);
          } else {
            operatingRidesArray.push(ride);
          }
        });
        setOperatingRides(operatingRidesArray);
        setClosedRides(closedRidesArray);
        setParkData(res.data);
      });
    axios
      .get("http://localhost:3001/disneyworld-magickingdom-parkhours")
      .then((res) => {
        // console.log(res.data[0]);
        setParkHours(res.data[0]);
        setOpeningTime(res.data[0].openingTime.split("T")[1].split("-")[0]);
        setClosingTime(res.data[0].closingTime.split("T")[1].split("-")[0]);
      });
  }, []);

  const openRideList = _.orderBy(operatingRides, ["waitTime"], ["desc"]).map(
    (ride) => {
      return (
        <Grid item xs={12} sm={6} md={3} key={ride.id}>
          <Card className={classes.root}>
            <CardHeader
              className={classes.header}
              avatar={
                <Avatar aria-label="Attraction Type" className={classes.avatar}>
                  {ride.waitTime}
                </Avatar>
              }
              title={ride.name}
              subheader={"Status: " + ride.status}
            />
            {rideMP4[ride.name] ? (
              <CardMedia
                className={`me-media-cinemagraph no-media-autotrack me-lazy-loaded ${classes.media_mp4}`}
                autoPlay
                loop
                component="video"
                image={rideMP4[ride.name]}
              />
            ) : (
              <CardMedia
                className={classes.media}
                image={rideImages[ride.name]}
              />
            )}
            <CardContent className={classes.footer}>
              <Typography variant="body2" color="textSecondary">
                Type: {ride.meta.type}
                <br />
                Current Wait Time: {ride.waitTime} mins
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    }
  );

  const closedRideList = _.orderBy(closedRides, ["status"], ["desc"]).map(
    (ride) => {
      return (
        <Grid item md={3} key={ride.id}>
          <Card className={classes.root}>
            <CardHeader
              className={classes.header}
              avatar={
                <Avatar aria-label="Attraction Type" className={classes.avatar}>
                  N/A
                </Avatar>
              }
              title={ride.name}
              subheader={"Status: " + ride.status}
            />
            {rideMP4[ride.name] ? (
              <CardMedia
                className="me-media-cinemagraph no-media-autotrack me-lazy-loaded"
                autoPlay
                loop
                component="video"
                image={rideMP4[ride.name]}
              />
            ) : (
              <CardMedia
                className={classes.media}
                image={
                  rideImages[ride.name] ||
                  "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
                }
              />
            )}
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                Type: {ride.meta.type ? ride.meta.type : "MEET AND GREET"}
                <br />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    }
  );

  return (
    <div>
      <div>
        <h1>Wait Times: Disney World</h1>
        <h2>
          Date: {parkHours.date} Hours: {openingTime} - {closingTime}
        </h2>
        <h2>Operating Rides</h2>
        <Grid container spacing={2}>
          {openRideList}
        </Grid>
      </div>
      <div>
        <h2>Closed/Under Refurishment</h2>
        <Grid container spacing={2}>
          {closedRideList}
        </Grid>
      </div>
    </div>
  );
}
export default Parks;
