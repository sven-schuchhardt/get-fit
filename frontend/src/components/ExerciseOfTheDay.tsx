import { Alert, AlertColor, Box, Button, Card, CircularProgress, Divider, Snackbar, useTheme } from "@mui/material";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "yup";
import { useApiClient } from "../adapter/api/useApiClient";
import { WeightTrainingExercise, YogaExercise } from "../adapter/api/__generated";
import { app } from "../FirebaseAuthentication";
import { SectionHeading } from "./SectionHeading";

type Exercises = {
    weightTrainingExercise: WeightTrainingExercise;
    yogaExercise: YogaExercise;
}

export const ExerciseOfTheDay = () => {

    const theme = useTheme();
    const auth = getAuth(app);
    const api = useApiClient();
    const [isOpen, setIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [exercises, setExercises] = useState<Exercises>();
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const fetchedWeightTrainingExercise = await api.getWithoutAuthWeightTrainingExercisesAllDefault();
                    if (fetchedWeightTrainingExercise.status == 200) {
                        setExercises({ weightTrainingExercise: fetchedWeightTrainingExercise.data[0], yogaExercise: fetchedWeightTrainingExercise.data[1] });
                    }

                    setIsLoading(false);
                } catch (e) {
                    if (axios.isAxiosError(e) && e.response) {
                        const errorBody = e.response.data as ValidationError;
                        setAlertMessage(errorBody.message);
                        setSeverity("error");
                        setIsOpen(true);
                    }
                }
            }
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Box className="header-background" sx={{
                backgroundColor: theme.palette.background.paper,
                display: "flex", justifyContent: "center", height: 160
            }}>
                <SectionHeading heading="Exercise of the day" />
            </Box>
            {isLoading ? (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><CircularProgress /></Box>) :
                (<>
                    <Box sx={{
                        display: "flex", justifyContent: "space-evenly",
                        alignItems: "center", margin: 5
                    }}>
                        <ExerciseOfTheDayCard img={exercises?.weightTrainingExercise.imageOrGifUrl} exerciseTitel={exercises?.weightTrainingExercise.name}
                            exerciseDescription={exercises?.weightTrainingExercise.description} exerciseId={exercises?.weightTrainingExercise.id} />
                        <Divider orientation="vertical" variant="middle" sx={{ color: "white", height: 500, border: 1 }} />
                        <ExerciseOfTheDayCard img={exercises?.yogaExercise.imageOrGifUrl}
                            exerciseTitel={exercises?.yogaExercise.name}
                            exerciseDescription={exercises?.yogaExercise.description} exerciseId={exercises?.weightTrainingExercise.id} />
                    </Box></>)}
            <Snackbar open={isOpen} onClose={() => setIsOpen(false)}
                autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={severity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export const ExerciseOfTheDayCard = (props: {
    img: string,
    exerciseTitel: string,
    exerciseDescription: string
    exerciseId: string
}) => {

    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Card sx={{
            display: "flex", flexDirection: "column", flexWrap: "nowrap",
            justifyContent: "space-around", alignItems: "center",
            backgroundColor: theme.palette.secondary.main,
            borderRadius: 4, margin: 4
        }}>
            <img alt="Exercise" src={props.img} width="450" height="350" style={{ margin: 3 }} />
            <Box sx={{
                display: "flex", flexDirection: "column", flexWrap: "nowrap",
                justifyContent: "center", alignItems: "flex-start",
                backgroundColor: theme.palette.secondary.main,
                borderRadius: 4, margin: 4
            }}>
                <Box sx={{
                    display: "flex", justifyContent: "flex-start",
                    fontSize: theme.typography.h5, marginBottom: 3
                }}>
                    {props.exerciseTitel}
                </Box>
                <Box>
                    {props.exerciseDescription}
                </Box>
            </Box>
            <Divider variant="middle" sx={{
                color: theme.palette.background.default, width: "85%"
            }} />
            <Button onClick={() => navigate("/exercisepage/info", { state: { id: props.exerciseId } })}
                variant="contained" sx={{ margin: 2, color: "white" }}>
                Check out!
            </Button>
        </Card>
    );
}