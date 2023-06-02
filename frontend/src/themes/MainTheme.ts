import { pink, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import type {} from '@mui/x-date-pickers/themeAugmentation';

export const mainTheme = createTheme({
    palette: {
        primary: {
            main: "#F4BF4F", //Main Color
        },
        secondary: {
            main: "#FFFFFF",
        },
        text: {
            primary: "#000000", //Black
            secondary: "#FFFFFF" //Heading, Body
        },
        error: {
            main:"#F44336", //Warning Red
        },
        background: {
            default: "#3F3F3F", //Dark grey
            paper: "#202124" //Footer Background
        },
    },
    typography: {
        h1:{
            fontSize: 53,
        },
        h2: {
            fontSize: 45,
        },
        h3: {
            fontSize: 30,
        },
        button: {
            fontSize: 15,
        },
        body1:{
            fontSize: 15,
        },
        fontFamily: [
          'Roboto',
          'Arial', 
        ].join(','),
      },
});

