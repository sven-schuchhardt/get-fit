import { Box } from "@mui/material";
import { RegisterCard } from "../components/RegisterCard";


export const RegisterPage = () => {

    return(

        <Box sx={{display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundImage: `url(${"../src/public/bodybuilder_black_white_1.png"})`}}>

                <RegisterCard />
        </Box>
    );
}