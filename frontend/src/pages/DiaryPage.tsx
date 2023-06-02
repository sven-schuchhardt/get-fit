import { app } from "../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'firebase/compat/auth';
import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { DataGrid, GridColumns } from '@mui/x-data-grid';
import dayjs, { Dayjs } from "dayjs";
import { AppHeader } from "../components/AppHeader";
import { Box } from "@mui/system";
import { AppFooter } from "../components/Footer";
import Grid from "@mui/material/Grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { useApiClient } from "../adapter/api/useApiClient";
import { WeightTrainingExercisePlan, WeightTrainingExerciseDiaryEntry } from "../adapter/api/__generated";




export const DiaryPage = () => {
  const auth = getAuth(app);
  const api = useApiClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setLoading] = useState(true);
  const [display, setDisplay] = useState('');
  const [token, setToken] = useState('');
  const [plans, setPlans] = useState<WeightTrainingExercisePlan[]>([]);
  const [today] = useState<string>('2023-04-19');
  const [date, setDate] = React.useState<Dayjs>(dayjs(today));
  const [entry, setEntry] = useState<WeightTrainingExerciseDiaryEntry>();
  let idCounter = 1;

  const fetchData = async (user) => {
    const id = "63f18ea6315f3de3c2623e45";

    try {

      //alle pläne ranholen
      const p = await api.getWeightTrainingExercisePlanAll(user.accessToken);
      setPlans(p.data);


      setToken(user.accessToken);

      //user ranholen
      const u = await api.getUserId(user.accessToken);


      

      //einträge von aktivem plan holen
      type getWeightTrainingExerciseDiaryEntryByDatePlanUserRequest = {
        date: string,
      }
      const d: getWeightTrainingExerciseDiaryEntryByDatePlanUserRequest = {
        date: new Date(today).toISOString()
      }
      const ent = await api.getWeightTrainingExerciseDiaryEntryByDatePlanUser(user.accessToken, u.data.activePlan.id, d);
      setEntry(ent.data);
    
      setLoading(false);

    } catch (e: unknown) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user);
      }
    });
  }, []);

  const createRow = (i: number) => {
    idCounter += 1;
    return {
      id: idCounter,
      day: entry?.weightTrainingExercisePlan?.exercises[i].day,
      exercise: entry?.weightTrainingExercisePlan?.exercises[i].exercise.name,
      sets: entry?.weightTrainingExercisePlan?.exercises[i].setAmount,
      reps: entry?.weightTrainingExercisePlan?.exercises[i].repetition,
      weight: "20kg",
      date: "2023-02-14"
    };
  }


  const generateRows = () => {
    const x = new Array(entry?.weightTrainingExercisePlan?.exercises.length)
    if (entry == undefined) {
      const y = new Array(1);
      y[0] = {
        id: 1,
        day: '----',
        exercise: '----',
        sets: 0,
        reps: 0,
        weight: "----",
        date: "----"
      };
      return y;
    }
    for (let i = 0; i < x.length; i++) {
      x[i] = createRow(i);
    }
    return x;
  }

  const handleChange = (event: SelectChangeEvent) => {
    setDisplay(event.target.value as string);
  };





  function changeDate(event) {
    setDate(event);
    console.log(date);
  }

  async function newEntry(event) {
    type PostWeightTrainingExerciseDiaryEntryRequest = {
      date: string,
      weightTrainingExercisePlan: string,
      note: string
    }
    const d: PostWeightTrainingExerciseDiaryEntryRequest = {
      date: date?.toISOString(),
      weightTrainingExercisePlan: display,
      note: 'default note'
    }
    try {
      const res = await api.postWeightTrainingExerciseDiaryEntry(token, d);
    } catch (e: unknown) {
      console.error(e);
    }

  }

  async function loadEntry(event) {

    try {
      //const ent = await api.getWeightTrainingExerciseDiaryEntryByDatePlanUser(token, display, date);
      type WeightTrainingExerciseDiaryEntry = {
        id: string,
        createdAt: string,
        updatedAt: string,
        note: string,
        date: string,
        weightTrainingExercisePlan: WeightTrainingExercisePlan,
      }
      const y = await api.getWeightTrainingExercisePlanOne(token, "63f23538717e520a9be2988b")

      const x: WeightTrainingExerciseDiaryEntry = {
        id: "63f249bf717e520a9be29899",
        createdAt: "2023-02-19T16:09:35.596Z",
        updatedAt: "2023-02-19T16:09:35.596Z",
        note: "default note",
        date: "2023-02-14T16:09:22Z",
        weightTrainingExercisePlan: y.data,
      }

      setEntry(x);
    } catch (e: unknown) {
      console.error(e);
    }

  }

  async function updateEntry(event) {
    type putWeightTrainingExerciseDiaryEntryUpdateRepetitionAndAmountRequest = {
      weightTrainingExercise: string,
      repitition: string,
      amount: string,
    }

    const x: putWeightTrainingExerciseDiaryEntryUpdateRepetitionAndAmountRequest = {
      weightTrainingExercise: "63f233e4717e520a9be29336",
      repitition: "30",
      amount: "20"
    }
    try {
      const ret = await api.putWeightTrainingExerciseDiaryEntryUpdateRepetitionAndAmountId(token, entry.id, x);
    } catch (e: unknown) {
      console.error(e);
    }

  }

  if (!isLoading) {
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundImage: `url(${"../src/assets/background.jpg"})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "30vh",
        width: "100%",
      }}
    >
      <AppHeader />
      <Box sx={{ width: 150, height: 125 }}></Box>
      <Card
        sx={{
          backgroundColor: "primary.main",
          margin: 3,
          display: "inline-flex",
        }}
      >
        <CardContent>
          <Typography>{"Diary Entry"}</Typography>
        </CardContent>
      </Card>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 80, backgroundColor: "grey"}}>
        <InputLabel id="select-plan-label">Select Plan</InputLabel>
        <Select
          labelId="select-plan-label"
          id="select-plan"
          value={display}
          label="Plan"
          onChange={handleChange}
        >
          {plans?.map(p => (
            <MenuItem key={p.title} value={p.id}>
              {p.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container direction="row" alignContent={"center"}>
        <Card
          sx={{
            backgroundColor: "primary.main",
            margin: 3,
            display: "inline-flex",
          }}>
          <div style={{ display: 'flex', height: '100%' }}>
            <DataGrid
              sx={{ minWidth: 650 }}
              rows={generateRows()}
              columns={columns}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div>
        </Card>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignContent: 'flex-start'
        }}>
          <IconButton
            sx={{ border: "solid 2px", backgroundColor: "primary.main" }}
            onClick={updateEntry}
          >
            <SaveIcon />
          </IconButton>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }} marginLeft={5}>
          <Card
            sx={{
              backgroundColor: "primary.secondary",
              margin: 3,
              display: "inline-flex",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>

              <CalendarPicker
                date={date}
                onChange={changeDate}
              />
            </LocalizationProvider>
          </Card>
          <Box>
            <Button
              sx={{ marginBottom: 2 }}
              variant="contained"
              color="primary"
              onClick={loadEntry}
            >
              Load Entry
            </Button>
          </Box >
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={newEntry}
            >
              Create a new Entry
            </Button>
          </Box >
        </Box>
      </Grid>
      <Box margin={5} paddingBottom={3}>
        {/*<Cards title="Comments" text="" />*/}
        <Card
          sx={{
            backgroundColor: "primary.main",
            display: "inline-flex",
            zIndex: "1",
          }}
        >
          <CardContent>Notes</CardContent>
        </Card>
        <Card
          sx={{
            backgroundColor: "#5F6367",
            marginLeft: 1,
            zIndex: "2",
          }}
        >
          <CardContent>
            <Typography color="secondary.main">{entry?.note}</Typography>
          </CardContent>
        </Card>
      </Box>
      <AppFooter />
    </Box>
  );
};

const columns: GridColumns = [
  {
    field: 'day',
    headerName: 'Day',
    editable: false,
    headerAlign: 'center',
  },
  {
    field: 'exercise',
    headerName: 'Exercise',
    editable: false,
    headerAlign: 'center',
    minWidth: 250,

  },
  {
    field: 'sets',
    headerName: 'Sets',
    editable: false,
    headerAlign: 'center',
  },
  {
    field: 'reps',
    headerName: 'Reps',
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'weight',
    headerName: 'Weight',
    editable: true,
    headerAlign: 'center',
  }
]
