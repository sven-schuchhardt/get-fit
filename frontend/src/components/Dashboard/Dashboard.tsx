import { Alert, AlertColor, Box, CircularProgress, Snackbar, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../FirebaseAuthentication";
import { ValidationError } from "yup";
import axios from "axios";
import {
    WeightTrainingExercisePlan, User,
    WeightTrainingExerciseDiaryEntry,
} from "../../adapter/api/__generated";
import { ProgressChart } from "../ProgressChart";
import { BoxHeading, RenderDashboardTrainingPlan, RenderDiaryEntryBox } from "./DashboardComponents";
import { useApiClient } from "../../adapter/api/useApiClient";

export type ChartData = {
    diaryEntry: WeightTrainingExerciseDiaryEntry;
    amount: number;
    repetition: number;
}

export const Dashboard = () => {

    const theme = useTheme();
    const api = useApiClient();
    const auth = getAuth(app);
    const [isOpen, setIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [user, setUser] = useState<User>();
    const [activeExercisePlan, setActiveExercisePlan] = useState<WeightTrainingExercisePlan>();
    const [chartData, setChartData] = useState<ChartData[]>();
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const uid = await user.getIdToken();
                    const fetchedUser = await api.getUserId(uid);
                    if (fetchedUser.status == 200) {
                        setUser(fetchedUser.data);
                        if (!fetchedUser.data.activePlan) {
                            setActiveExercisePlan(fetchedUser.data.activePlan);
                        }
                    }

                    /*const fetchedChartData = await api.getWeightTrainingExerciseDiaryEntryGetSummarizedDataLast7Days(uid);

                    if (fetchedChartData.status == 200) {
                        setChartData(fetchedChartData.data);
                    }*/

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
            {isLoading ? (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90%" }}><CircularProgress /></Box>) :
                (<Box sx={{
                    display: "flex", justifyContent: "center", flexDirection: "column",
                    alignItems: "center", height: "85%", padding: 7
                }}>
                    <Box sx={{
                        display: "flex", justifyContent: "flex-start",
                        width: "100%",
                        color: theme.palette.text.secondary, fontSize: theme.typography.h3, margin: 2
                    }}>
                        {user && ("Are you ready " + user?.firstName + "?")}
                    </Box>
                    <Box sx={{
                        display: "flex", justifyContent: "center",
                        alignItems: "flex-start", height: "100%", width: "100%"
                    }}>
                        <Box sx={{
                            display: "flex", flexDirection: "column", backgroundColor: "#eaecec",
                            opacity: "0.9", borderRadius: 5, width: "50%", height: "100%"
                        }}>
                            <BoxHeading>Today's Training</BoxHeading>
                            <Box sx={{ display: "flex", justifyContent: "center", height: "100%", alignItems: "center", width: "100%" }}>
                                {activeExercisePlan ? (<RenderDashboardTrainingPlan activeExercisePlan={activeExercisePlan} />)
                                    :
                                    (<Box sx={{ fontSize: 20 }}>No active training plan</Box>)}
                            </Box>
                        </Box>
                        <Box sx={{
                            display: "flex", flexDirection: "column", width: "50%", height: "100%", marginLeft: 1,
                        }}>
                            <Box sx={{
                                backgroundColor: "#eaecec", opacity: "0.9", borderRadius: 5, height: "50%",
                                marginBottom: 1
                            }}>
                                <BoxHeading>Diary</BoxHeading>
                                <Box sx={{
                                    display: "flex", flexDirection: "row",
                                    justifyContent: "space-evenly", alignItems: "center"

                                }}>
                                    <RenderDiaryEntryBox />
                                </Box>
                            </Box>
                            <Box sx={{ backgroundColor: "#eaecec", opacity: "0.9", borderRadius: 5, height: "50%" }}>
                                <BoxHeading>Progress</BoxHeading>
                                <Box sx={{ height: "80%", padding: "2%" }}>
                                    {!isLoading && <ProgressChart data={chartData} />}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Snackbar open={isOpen} onClose={() => setIsOpen(false)}
                        autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                        <Alert severity={severity} sx={{ width: '100%' }}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </Box>)}
        </>
    );
}