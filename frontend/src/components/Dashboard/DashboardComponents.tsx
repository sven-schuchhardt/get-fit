import { AlertColor, Box, Divider, Snackbar, useTheme, IconButton, Alert, ButtonBase } from "@mui/material";
import {
    WeightTrainingExerciseDiaryEntry,
    WeightTrainingExercisePlan,
    WeightTrainingExerciseweightTrainingExercisePlan,
} from "../../adapter/api/__generated/api";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useState } from "react";
import axios from "axios";
import { ValidationError } from "yup";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../FirebaseAuthentication";
import { useApiClient } from "../../adapter/api/useApiClient";
import ImageIcon from '@mui/icons-material/Image';
import { useNavigate } from "react-router-dom";

type Diaries = {
    diaryEntry: WeightTrainingExerciseDiaryEntry;
    amount: number;
    repetition: number;
}

export const RenderDiaryEntryBox = () => {

    const api = useApiClient();
    const auth = getAuth(app);
    const [isOpen, setIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [diaryEntries, setDiaryEntries] = useState<Diaries[]>();
    const [leftDiaryEntry, setLeftDiaryEntry] = useState(0);
    const [rightDiaryEntry, setRightDiaryEntry] = useState(1);
    const [rightArrow, setRightArrow] = useState<JSX.Element>(<></>);
    const [leftArrow, setLeftArrow] = useState<JSX.Element>(<></>);
    const [isLoading, setIsLoading] = useState(true);

    const swapDiaryEnties = (direction: string) => {
        //Checks whether diary entry in right box is the last one
        if (direction == "right") {
            if (rightDiaryEntry != (diaryEntries.length - 1)) {
                setRightDiaryEntry((rightDiaryEntry + 1));
                setLeftDiaryEntry((leftDiaryEntry + 1));
            }
        }
        //Checks whether diary entry in left box is the first one
        if (direction == "left") {
            if (leftDiaryEntry != 0) {
                setRightDiaryEntry((rightDiaryEntry - 1));
                setLeftDiaryEntry((leftDiaryEntry - 1));
            }
        }
    }

    const fetchData = () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {

                    const fetchedDiaries = await api.getWeightTrainingExerciseDiaryEntryGetSummarizedDataLast7Days(await user.getIdToken());

                    if (fetchedDiaries.status == 200) {
                        setDiaryEntries(fetchedDiaries.data);
                        setLeftDiaryEntry((fetchedDiaries.data.length - 2));
                        setRightDiaryEntry((fetchedDiaries.data.length - 1));

                        if (rightDiaryEntry != (fetchedDiaries.data.length - 1)) {
                            setRightArrow(<ArrowForwardIosIcon onClick={() => swapDiaryEnties("right")} />);
                        }
                        if (leftDiaryEntry != 0) {
                            setLeftArrow(<ArrowBackIosNewIcon onClick={() => swapDiaryEnties("left")} />);
                        }

                        setIsLoading(false);
                    }
                } catch (e) {
                    if (axios.isAxiosError(e) && e.response) {
                        const errorBody = e.response.data as ValidationError;
                        setAlertMessage(errorBody.message);
                        setSeverity("error");
                        setIsOpen(true);
                    }
                }
            }
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    const changeDateFormat = (data: string) => {
        const day = data.slice(8, 10);
        const month = data.slice(5, 7);
        return (`${day}.${month}`);
    }

    return (
        <>
            {!isLoading && (<Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
                <DiaryEntryBox date={changeDateFormat(diaryEntries[rightDiaryEntry].diaryEntry.updatedAt)}
                    arrow={leftArrow}>{diaryEntries[rightDiaryEntry]?.diaryEntry?.note}</DiaryEntryBox>

                <DiaryEntryBox date={changeDateFormat(diaryEntries[leftDiaryEntry].diaryEntry.updatedAt)}
                    arrow={rightArrow}>{diaryEntries[leftDiaryEntry].diaryEntry?.note}</DiaryEntryBox>
            </Box>)}
            <Snackbar open={isOpen} onClose={() => setIsOpen(false)}
                autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={severity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export const DiaryEntryBox = (props: { children: string, date: string, arrow: JSX.Element }) => {

    const theme = useTheme();

    return (
        <>
            <Box sx={{
                display: "flex", justifyContent: "center", flexDirection: "column",
                color: theme.palette.text.primary,
                backgroundColor: "#dddddd", borderRadius: 2, marginX: 3, width: "100%", height: "100%"
            }}>
                <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "row", fontSize: 20, margin: 2 }}>
                    <Box sx={{ marginX: 1 }}>
                        {props.date}
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", fontSize: theme.typography.body1, margin: 2 }}>
                    {props.children}
                </Box>
                <IconButton>
                    {props.arrow}
                </IconButton>
            </Box>
        </>
    );
}

export const BoxHeading = ({ children }) => {

    const theme = useTheme();

    return (
        <Box sx={{
            display: "flex", justifyContent: "center",
            fontSize: theme.typography.h3, color: theme.palette.text.primary,
            margin: 2
        }}>
            {children}
        </Box>
    );
}

export const TrainingPlanEntry = (props: { image: string, name: string, setAmount: number, repetition: number, last: boolean, id: string }) => {
    const navigate = useNavigate();

    return (
        <ButtonBase onClick={() => navigate("/exercisepage/info", { state: { id: props.id } })}
            sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center", margin: 1, padding: 1,
                height: "100%", width: "80%", flexWrap: "wrap"
            }}>
                {props.image ? (<Box component="img" src={props.image} sx={{ height: 100, margin: 1 }} />) : (<ImageIcon fontSize="large" />)}
                <Box sx={{ fontSize: 17, margin: 1 }}>{props.name}</Box>
                <Box sx={{ fontSize: 17, margin: 1 }}>{props.setAmount + " kg"}</Box>
                <Box sx={{ fontSize: 17, margin: 1 }}>{props.repetition + " rep."}</Box>
            </Box>
            {props.last ? (<Divider variant="middle" sx={{ margin: 1, color: "black", width: "80%" }} />) : ""}
        </ButtonBase >
    );
}

export const RenderDashboardTrainingPlan = (props: { activeExercisePlan: WeightTrainingExercisePlan }) => {

    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "scroll", width: "100%", margin: 4 }}>
            {props.activeExercisePlan.exercises.map((value: WeightTrainingExerciseweightTrainingExercisePlan, index) => {
                return (<TrainingPlanEntry
                    key={value.exercise.id}
                    image={value.exercise.imageOrGifUrl}
                    name={value.exercise.name}
                    setAmount={value.setAmount}
                    repetition={value.repetition}
                    last={props.activeExercisePlan.exercises.length - 1 == index ? false : true}
                    id={value.exercise.id}
                />)
            })}
        </Box>
    );
}
