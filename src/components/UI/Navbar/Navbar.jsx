import { CleaningServicesOutlined } from "@mui/icons-material";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ background: "#ff0000" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CleaningServicesOutlined
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
            variant="h5"
            component={Link}
            noWrap
            to="/"
          >
            Clean Youtube
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
