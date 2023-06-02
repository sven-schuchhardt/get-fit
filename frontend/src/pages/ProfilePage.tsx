import { Box } from "@mui/material";
import { AppHeader } from "../components/AppHeader";
import { ProfileCard } from "../components/ProfileCard";

export const ProfilePage = () => {

    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                backgroundImage: `url(${"../src/public/bodybuilder_black_white_1.png"})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}>
                <AppHeader />
                <ProfileCard />
            </Box>
        </>
    );
}