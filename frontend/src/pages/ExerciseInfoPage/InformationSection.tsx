import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Cards } from "../../components/Cards";
import { Buttons } from "./Buttons";
import { VideoTile } from "./VideoTile";
import { SecondRow } from "./SecondRow";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography/Typography";

export const InformationSection = (exerciseProp) => {
  const exercise = exerciseProp.exercise;
  const createdByUser = exercise.createdByUser;
  return (
    <Box>
      <Grid container spacing={10} direction="row" marginLeft={2}>
        <Grid item xs={5}>
          <Cards title="Description" text={exercise.description} />
        </Grid>
        <Grid item xs={7}>
          <Box
            component="img"
            sx={{
              width: 350,
              height: 250,
            }}
            src={exercise.imageOrGifUrl}
          ></Box>
        </Grid>
        <Grid item>
          <SecondRow exercise={exercise} />
        </Grid>
      </Grid>

      <VideoTile exercise={exercise} />

      {createdByUser && <Buttons exercise={exercise} />}
    </Box>
  );
};
