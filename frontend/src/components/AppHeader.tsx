import { Alert, AlertColor, Button, Box, ButtonBase, Divider, Link, Snackbar, useTheme } from '@mui/material';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { app } from '../FirebaseAuthentication';

type ButtonProps = {
    text: string;
    link: string;
};

export const AppHeader = () => {

    const theme = useTheme();
    const auth = getAuth(app);

    const [leftButtonProps, setLeftButtonProps] = useState<ButtonProps>({ text: "", link: "" });
    const [rightButtonProps, setRightButtonProps] = useState<ButtonProps>({ text: "", link: "" });
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [isLoading, setIsLoading] = useState(true);

    const LinkSx = {
        color: theme.palette.text.secondary,
        fontSize: theme.typography.button,
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setLeftButtonProps({ text: "Logout", link: "/home" });
                setRightButtonProps({ text: "Profile", link: "/profile" });
                // ...
            } else {
                // User is signed out
                setLeftButtonProps({ text: "Login", link: "/login" });
                setRightButtonProps({ text: "Register", link: "/register" });
            }
            setIsLoading(false);
        });
    }, []);

    const handleClose = () => {
        setOpen(false);
        setAlertMessage("");
    }

    const handleLogOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.currentTarget.firstChild?.nodeValue == "Logout") {
            signOut(auth).then(() => {
                // Sign-out successful.
                setAlertMessage("Signed out successfully!");
                setSeverity("success");
                setOpen(true);
            }).catch((error) => {
                // An error happened.
                setAlertMessage("Error occurred while sign out");
                setSeverity("error");
                setOpen(true);
            });
        }
    }

    return (
        <>
            {!isLoading && (<Box sx={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between" }}>
                <Box sx={{ justifyContent: "flex-start", marginX: 7, marginTop: 7 }}>
                    <ButtonBase component={RouterLink} to="/home" sx={{ marginLeft: 2, width: 10, height: 10 }}>
                        <img alt="Logo" src="../src/public/Logo.png" width="70" height="70" />
                    </ButtonBase>
                </Box>
                <Box sx={{ justifyContent: "flex-end" }}>
                    <Box sx={{
                        display: "flex", justifyContent: "space-around",
                        alignItems: "center", background: "#d9d9d970",
                        width: 700, height: 33, borderRadius: 4, margin: 4, marginTop: 5
                    }}>
                        <Link href="/home" underline="none" sx={{ marginLeft: 1, ...LinkSx }}>Home</Link>
                        <Link href="/yoga" underline="none" sx={LinkSx}>Yoga</Link>
                        <Link href="/strengthtraining" underline="none" sx={LinkSx}>Strengh Training</Link>
                        <Link href="/exercisepage" underline="none" sx={LinkSx}>Exercises</Link>
                        <Link href="/diary" underline="none" sx={LinkSx}>Diary Page</Link>
                        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "nowrap" }}>
                            <NavBarButton buttonProps={leftButtonProps} handleLogOut={handleLogOut} />
                            <Divider orientation="vertical" variant="middle" flexItem sx={{
                                border: 1,
                                color: theme.palette.secondary.main, marginX: 1, marginY: 0.4
                            }} />
                            <NavBarButton buttonProps={rightButtonProps} handleLogOut={undefined} />
                        </Box>
                        <Snackbar open={open} onClose={handleClose}
                            autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                            <Alert severity={severity} sx={{ width: '100%' }}>
                                {alertMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
            </Box>)}
        </>
    );
}

export const NavBarButton = (props: {
    buttonProps: ButtonProps,
    handleLogOut: undefined | ((e: React.MouseEvent<HTMLAnchorElement>) => void)
}) => {

    const theme = useTheme();

    return (
        <Button variant="contained" onClick={props.handleLogOut} component={RouterLink} to={props.buttonProps.link}
            sx={{
                background: theme.palette.primary.main,
                color: theme.palette.secondary.main,
                fontSize: theme.typography.button,
                borderRadius: 20,
                maxHeight: 25,
            }}>{props.buttonProps.text}</Button>
    );
};

