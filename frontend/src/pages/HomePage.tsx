import { Box, useTheme, Snackbar, Alert, AlertColor } from "@mui/material";
import { useEffect, useState} from "react";
import { AppHeader } from "../components/AppHeader";
import { ExerciseOfTheDay } from "../components/ExerciseOfTheDay";
import { NewsSection } from "../components/NewsSection";
import { AppFooter } from "../components/Footer";
import { app } from "../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Dashboard } from "../components/Dashboard/Dashboard";

export const HomePage = () => {

    const theme = useTheme();
    const auth = getAuth(app);
    const [isOpen, setIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [topSectionContent, setTopSectionContent]= useState(<></>);

    const handleClose = () => {
        setIsOpen(false);
        setAlertMessage("");
    }
    

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                if (!!localStorage.getItem("currentlyLoggedIn")) {
                    localStorage.removeItem("currentlyLoggedIn");
                    setAlertMessage("Successfully logged in!");
                    setSeverity("success");
                    setIsOpen(true);
                }
                if (!!localStorage.getItem("currentlySignedUp")) {
                    localStorage.removeItem("currentlySignedUp");
                    setAlertMessage("Successfully signed up!");
                    setSeverity("success");
                    setIsOpen(true);
                }
                if (!!localStorage.getItem("currentlyLoggedOut")) {
                    localStorage.removeItem("currentlyLoggedOut");
                    setAlertMessage("Successfully logged out!");
                    setSeverity("success");
                    setIsOpen(true);
                }
                setTopSectionContent(<Dashboard />);
            } else {
                setTopSectionContent(<Cite />);
            }
        })
    }, []);

    return (
        <>
            <Box sx={{ backgroundColor: theme.palette.background.default }}>
                <Box sx={{
                    backgroundImage: `url(${"../src/public/bodybuilder_black_white_1.png"})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    height: "100vh",
                    zIndex: 2,
                }}>
                    <AppHeader />            
                    {topSectionContent}
                </Box>
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    height: "100%",
                }}>
                    <ExerciseOfTheDay />
                </Box>
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    height: "100%",
                }}>
                    <NewsSection />
                </Box>
                <AppFooter />
                <Snackbar open={isOpen} onClose={handleClose}
                    autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                    <Alert severity={severity} sx={{ width: '100%' }}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
}

export const Cite = () => {

    const theme = useTheme();

    return (
        <Box sx={{
            display: "flex", justifyContent: "center",
            alignItems: "center", height: "100vh",
        }}>
            <Box sx={{ fontSize: theme.typography.h3, color: theme.palette.text.secondary }}>
                <Box>
                    "Once you learn to quit, it becomes a habit.¨
                </Box>
            </Box>
        </Box>
    );
}