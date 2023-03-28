import { Container, Typography } from "@mui/material";
import React from "react";
import InputField from "../UI/InputField/InputField";

const Home = () => {
  return (
    <Container>
      <Typography sx={{ textTransform: "uppercase" }}>Clean Youtube</Typography>
      <Typography>Past Your desired playlist id and hit add button</Typography>

      <InputField />
    </Container>
  );
};

export default Home;
