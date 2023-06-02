import { Box } from "@mui/system";
import { useState } from "react";
import Search from "@mui/icons-material/Search";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import InfoIcon from "@mui/icons-material/Info";
 
 export const InfoPopOver = ({description}) => {

    const [anchor, setAnchor] = useState(null);

    const handleClick = (event) => {
      setAnchor(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchor(null);
    };

    return(
        <Box>
        <IconButton
              aria-label="info"
              color="secondary"
              onClick={handleClick}
            >
              <InfoIcon />
            </IconButton>
            <Popover
              open={Boolean(anchor)}
              onClose={handleClose}
              anchorEl={anchor}
              anchorOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "left",
              }}
            >
              <Typography color="secondary">{description}</Typography>
            </Popover>
            </Box>
    )
}