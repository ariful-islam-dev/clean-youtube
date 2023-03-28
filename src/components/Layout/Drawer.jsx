import { useTheme } from "@emotion/react";
import styles from "./Drawer.module.css";

import {
  ChevronLeft,
  ChevronRight,
  CleaningServicesOutLined,
  MenuIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import YouTube from "react-youtube";
import useElapse from "../../hooks/useElapse";
import { convertStringTimeToSecs } from "../../utils/time";
import CustomTabs from "../UI/CustomTabs/CustomTabs";
const drawerWidth = 650;
const Main = styled("main", {
  shouldForwordProps: (props) => props !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwordProps: (props) => props !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function PlaylistContentDrawer({ playlist }) {
  console.log("Rendering Drawer Component");
  const [searchParams, setSearchParams] = useSearchParams();
  const [event, setEvent] = useState();

  const videoId = searchParams.get("video");
  const [selectedVideo, setSelectedVideo] = useState("");
  const playerRef = useRef();
  const videoState = useStoreState((state) => state.videoId);
  const videoData = videoState.data[playlist.playlistId];
  const elapseState = useStoreState((state) => state.elapsed);
  const playlistElapseState = elapseState.data[playlist.playlistId];
  const elapseActions = useStoreActions((actions) => actions.elapsed);

  const [startTime, setStartTime] = useState(0);
  const videoActions = useStoreActions((actions) => actions.videoId);
  const { elapsed } = useElapse(event);

  useEffect(() => {
    // Get video start time if exists!
    if (!playlistElapseState) {
      return;
    }
    if (playlistElapseState[videoId]) {
      setStartTime(convertStringTimeToSecs(playlistElapseState[videoId]));
    } else {
      setStartTime(0);
    }
  }, [videoId]);

  useEffect(() => {
    // Set Elapse time for video
    elapseActions.addElapse({
      playlistId: playlist.playlistId,
      videoId,
      elapsed,
    });
  }, [elapsed]);

  useEffect(() => {
    console.log("Setting Search Params with video id");
    let videoId;
    if (videoData) {
      videoId = videoData.videoId;
    } else {
      videoId = playlist.playlistItems[0].contentDetails.videoId;
    }
    setSearchParams({
      video: videoId,
    });
  }, []);

  useEffect(() => {
    videoActions.addVideoId({
      playlistId: playlist.playlistId,
      videoId,
    });
  }, [videoId]);

  useEffect(() => {
    setSelectedVideo(videoId);
  }, [videoId]);

  const videoInfo = playlist.playlistItems.find(
    (item) => item.contentDetails.videoId === videoId
  );

  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const onDurationChange = (secs) => {
    if (!event) {
      return;
    }

    event?.target?.seekTo(secs, true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOnVideoClick = (videoId) => {
    setSearchParams({
      video: videoId,
    });
  };
  const opts = {
    height: "590",
    width: "100%",
    playerVars: {
      autoplay: 1,
      rel: 0,
      start: startTime,
    },
  };

  const onChange = (e) => {
    if (
      e.data === YouTube.PlayerState.PAUSED ||
      e.data === YouTube.PlayerState.ENDED
    ) {
      setEvent(e);
    }
    return;
  };
  const onEnd = (e) => {
    elapseActions.removeVideoElapse({
      playlistId: playlist.playlistId,
      videoId: selectedVideo,
    });
    const currentVideoIndex = playlist.playlistItems.findIndex(
      (item) => item.contentDetails.videoId === selectedVideo
    );
    const nextVideoId =
      playlist.playlistItems[currentVideoIndex + 1].contentDetails.videoId;
    setSearchParams({
      video: nextVideoId,
    });

    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          sx={{
            background: "#ff0000",
            display: { sx: open ? "none" : "block", md: block },
          }}
          position="fixed"
          open={open}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
              <CleaningServicesOutLined
                sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
              />
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to={"/"}
                sx={{
                  mr: 2,
                  ml: 1,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  borderRadius: "1px solid #fff",
                  pr: 2,
                }}
              >
                CLEAN YOUTUBE
              </Typography>
              {/* for Mobile menu */}
              <CleaningServicesOutLined
                sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              />
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to={"/"}
                sx={{
                  mr: 2,
                  ml: 1,
                  display: { xs: "flex", md: "none" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  borderRadius: "1px solid #fff",
                  pr: 2,
                }}
              >
                CLEAN YOUTUBE
              </Typography>
              <div>
                <Typography
                  variant="h6"
                  sx={{
                    display: {
                      xs: "none",
                      md: "block",
                    },
                  }}
                >
                  {playlist.playlistTitle}
                </Typography>
              </div>
            </div>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerOpen}
              sx={{ ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Main
          sx={{
            marginRight: {
              xs: open ? 0 : "-100%",
              md: open ? 0 : `${-drawerWidth}px`,
            },
          }}
          open={open}
        >
          <DrawerHeader />
          <Container>
            <YouTube
              className={styles.player}
              videoId={selectedVideo}
              opts={opts}
              onReady={(e) => setEvent(e)}
              onStateChange={onChange}
              onEnd={onEnd}
              ref={playerRef}
            />
            <CustomTabs
              onDurationChange={onDurationChange}
              videoInfo={videoInfo}
              event={event}
              playlistId={playlist.playlistId}
            />
          </Container>
        </Main>
        {/* for mobile view */}
        <Drawer
          sx={{
            width: { xs: "100%", md: drawerWidth },
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: { xs: "100%", md: drawerWidth },
              bgcolor: "#000",
              color: "#fff",
              zIndex: { xs: "99", md: "0" },
            },
            zIndex: open ? "111" : "-1",
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          <DrawerHeader>
            <IconsButton>
              {theme.direction === "rtl" ? (
                <ChevronLeft sx={{ color: "#fff" }} />
              ) : (
                <ChevronRight sx={{ color: "#fff" }} />
              )}
            </IconsButton>
            <Typography
              variant="h6"
              noWrap
              sx={{ flexGrow: 1, color: "#fff" }}
              component={"div"}
            >
              {playlist.playlistTitle}
            </Typography>
          </DrawerHeader>
          <Divider />
          <List>
            {playlist.playlistItems.map((item, index) => (
              <div key={item.contentDetails.videoId}>
                <ListItemButton
                  selected={item.contentDetails.videoId === selectedVideo}
                  alignItems="center"
                  sx={{ gap: 2 }}
                  onClick={() =>
                    handleOnVideoClick(item.contentDetails.videoId)
                  }
                >
                  <ListItemAvatar>
                    <img
                      src={item.thumbnail?.url}
                      alt={item.title ? item.title : "Video"}
                      style={{
                        width: "150px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title ? item.title : "Title"}
                    secondary={
                      <Fragment>
                        <Typography
                          sx={{ display: "inline", color: "#fff" }}
                          component={"span"}
                          variant="body2"
                          color={"text.primary"}
                        >
                          {playlist.channelTitle}
                        </Typography>
                      </Fragment>
                    }
                  ></ListItemText>
                </ListItemButton>
                <Divider sx={{ borderColor: "rgb(205 205 205 / 21%" }} />
              </div>
            ))}
          </List>
        </Drawer>
      </Box>
    );
  };
}
