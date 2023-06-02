import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";

export const VideoTile = (exerciseProp) => {
  const exercise = exerciseProp.exercise;
  const [player, setPlayer] = useState(null);

  const onReady = (e) => {
    setPlayer(e.target);
  };

  return (
    <Grid container margin={5} spacing={5} direction="row" display="flex">
      <Grid item>
        <Card sx={{ backgroundColor: "primary.main" }}>
          <CardContent>Videos</CardContent>
        </Card>
      </Grid>
      <Grid item>
        <YouTube videoId={exercise.videoLink} onReady={onReady} />
      </Grid>
    </Grid>
  );
};
