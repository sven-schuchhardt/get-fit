import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import CssBaseline from '@mui/material/CssBaseline';
import { Button, ThemeProvider } from "@mui/material";
import { mainTheme } from "./themes/MainTheme";

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline enableColorScheme/>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
};
