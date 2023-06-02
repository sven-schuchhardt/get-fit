import { Box, Divider, useTheme, Link } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../FirebaseAuthentication";
import { Link as RouterLink } from 'react-router-dom';
import "../Styles/Forms.css"

export const AppFooter = () => {

    const theme = useTheme();
    const auth = getAuth(app);
    const [topNavLinks, setTopNavLinks] = useState<NavLinksProps[]>([]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setTopNavLinks([{
                    name: "Profile",
                    href: "/profile",
                    key: "profile"
                },
                ]);
            } else {
                setTopNavLinks([{
                    name: "Login",
                    href: "/login",
                    key: "login"
                },
                {
                    name: "Register",
                    href: "/register",
                    key: "register"
                },])
            }
        })
    }, []);

    return (
        <Box className="box" sx={{
            display: "flex", flexDirection: "row", flexWrap: "nowrap",
            justifyContent: "flex-start", alignItems: "center",
            backgroundColor: theme.palette.background.paper,
            width: "100%",
            heigth: "100%",
            marginTop: 3,
        }}>
            <Box sx={{ display: "flex", margin: 15, marginRight: "20%" }}>
                <img alt="Logo" src="../src/public/Logo.png" width="90" height="90" />
            </Box>
            <Box sx={{
                display: "flex", flexDirection: "column",
                alignItems: "flex-start", justifyContent: "space-between",
                flexWrap: "nowrap", margin: 6, flexGrow: 1
            }}>
                <NavRow>{topNavLinks}</NavRow>
                <Divider sx={{ color: "white", border: 1, width: "100%", marginY: 4, flexGrow: 1 }} />
                <NavRow>{bottomNavLinks}</NavRow>
            </Box>
        </Box>
    );
}

export type NavLinksProps = { name: string, href: string, key: string };

export const bottomNavLinks: NavLinksProps[] = [
    {
        name: "Home",
        href: "/home",
        key: "home"
    },
    {
        name: "Strengh Training",
        href: "/strengthtraining",
        key: "strenghtraining"
    },
    {
        name: "Yoga",
        href: "/yoga",
        key: "yoga"
    },
    {
        name: "Exercises",
        href: "/exercisepage",
        key: "exercises"
    },
]

export const NavRow = (props: { children: NavLinksProps[] }) => {

    return (
        <Box sx={{ display: "flex", justifyContent: "space-evenly", flexDirection: "row" }} >
            {props.children.map(renderNavRowLinks)}
        </Box>
    );
}

const renderNavRowLinks = (element: NavLinksProps) => {

    const theme = useTheme();

    const LinkSx = {
        fontSize: theme.typography.body1,
        color: theme.palette.text.secondary,
        marginRight: 10
    }

    return (
        <Link component={RouterLink} underline="hover" to={element.href} sx={LinkSx} key={element.key}>{element.name}</Link>
    );
}