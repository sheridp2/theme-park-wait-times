import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  header: {
    minHeight: 60,
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
    backgroundColor: red[500],
  },
}));
const rideImages = {
  "A Pirate's Adventure ~ Treasures of the Seven Seas":
    "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1600/900/75/dam/wdpro-assets/parks-and-tickets/attractions/magic-kingdom/pirates-adventures/pirate-adventures-treasure-of-the-seven-seas-00.jpg",
  "Be Our Guest Restaurant":
    "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1600/900/75/dam/wdpro-assets/gallery/dining/magic-kingdom/be-our-guest-restaurant/be-our-guest-restaurant-gallery04.jpg",
  "Buzz Lightyear's Space Ranger Spin":
    "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/630/354/75/dam/wdpro-assets/gallery/attractions/magic-kingdom/buzz-lightyear-space-ranger-spin/buzz-lightyear-space-ranger-spin-gallery00.jpg",
  "Cinderella's Royal Table":
    "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/630/354/75/dam/wdpro-assets/things-to-do/dining/magic-kingdom/cinderellas-royal-table/cinderella-royal-table-08.jpg",
};

const rideMP4 = {
  "Astro Orbiter":
    "https://cdn1.parksmedia.wdprapps.disney.com/dam/disney-world/attractions/magic-kingdom/astro-orbiter/cinemagraph/astro-orbiter-1280x720.mp4",
  "Big Thunder Mountain Railroad":
    "https://cdn1.parksmedia.wdprapps.disney.com/dam/disney-world/attractions/magic-kingdom/big-thunder-mountain-railroad/big-thunder-web-1280x720.mp4",
};

function Parks() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [parkData, setParkData] = useState([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/disneyworld-magickingdom-waittimes")
      .then((res) => {
        setParkData(res.data);
      });
  }, []);

  const parkList = parkData.map((ride) => {
    let rideName = ride.name
      .replace(/\s+/g, "-")
      .replaceAll("'", "")
      .replaceAll("~", "")
      .replaceAll("--", "-")
      .toLowerCase();

    // let rideImage = "../../assets/" + rideName + ".webp";
    console.log(ride);

    let urlNameMp4 =
      "https://cdn1.parksmedia.wdprapps.disney.com/dam/disney-world/attractions/magic-kingdom/" +
      rideName +
      "/cinemagraph/" +
      rideName +
      "-1280x720.mp4";

    console.log(ride.meta.type);

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
  });

  return (
    <Grid container spacing={2}>
      {parkList}
    </Grid>
  );
}
export default Parks;
