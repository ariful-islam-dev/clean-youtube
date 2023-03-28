import { useTheme } from "@emotion/react";
import { CleaningServicesOutLined } from "@mui/icons-material";
import { Box, CssBaseline } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import YouTube from "react-youtube";
import useElapse from "../../hooks/useElapse";
import { convertStringTimeToSecs } from "../../utils/time";
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
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    );
  };
}
