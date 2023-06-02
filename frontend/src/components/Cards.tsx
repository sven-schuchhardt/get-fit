import { Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";

export const Cards = ({ title, text }) => {
  return (
    <Box>
      <Card
        sx={{
          backgroundColor: "primary.main",
          display: "inline-flex",
          zIndex: "1",
        }}
      >
        <CardContent>
          <Typography>{title}</Typography>
        </CardContent>
      </Card>
      <Card
        sx={{
          backgroundColor: "#5F6367",
          marginLeft: 1,
          zIndex: "2",
        }}
      >
        <CardContent>
          <Typography color="secondary">{text}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
