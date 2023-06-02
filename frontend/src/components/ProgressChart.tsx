import { Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartData } from './Dashboard/Dashboard';

const changeDateFormat = (data: string) => {
    const day = data.slice(8,10);
    const month = data.slice(5,7);
    return(`${day}.${month}`);
}

export const ProgressChart = (props: { data?: ChartData[] }) => {

  props.data?.map((value: ChartData) => value.date = changeDateFormat(value.diaryEntry.updatedAt));

  return (
    <Box sx={{ height: "90%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={100}
          height={100}
          data={props.data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="repetition" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}