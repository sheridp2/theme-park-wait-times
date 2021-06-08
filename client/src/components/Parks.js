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
import { red } from "@material-ui/core/colors";
import { rideImages, rideMP4 } from "./rideImages";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  header: {
    minHeight: 70,
  },
  media: {
    height: 0,
    minWidth: 345,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "#113CCF",
  },
}));

function Parks() {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [parkData, setParkData] = useState([]);
  const [operatingRides, setOperatingRides] = useState([]);
  const [closedRides, setClosedRides] = useState([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
  }, []);

  const openRideList = _.orderBy(operatingRides, ["waitTime"], ["desc"]).map(
    (ride) => {
      return (
        <Grid item md={3} key={ride.id}>
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
                className="me-media-cinemagraph no-media-autotrack me-lazy-loaded"
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
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
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
                image={rideImages[ride.name]}
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
