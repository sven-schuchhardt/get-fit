import { Box} from "@mui/material";
import { LoginCard } from "../components/LoginCard";


export const LoginPage = () => {

    return(

        <Box sx={{display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundImage: `url(${"../src/public/bodybuilder_black_white_1.png"})`,}}>

                <LoginCard />
        </Box>
    );
}