import { trpc } from "@/utils";
import { NextPage } from "next";
import { Input, MenuItem, Select, TextField } from "@mui/material/";
import dayjs from "dayjs";
import { useState } from "react";
import { DayOfWeek } from "@/schema/dateTime";
import { DAY_OF_WEEK } from "@/constants";

const Page: NextPage = () => {
  const { mutateAsync } = trpc.tweet.create.useMutation();

  const [text, setText] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(DAY_OF_WEEK.MON);
  const [fromTime, setFromTime] = useState(dayjs());
  const [toTime, setToTime] = useState(dayjs());

  const create = async () => {
    let fromDate = fromTime.day(dayOfWeek);
    let toDate = toTime.day(dayOfWeek);

    if (fromDate.isBefore(dayjs())) {
      fromDate = fromDate.add(7, "day");
      toDate = toDate.add(7, "day");
    }

    try {
      const res = await mutateAsync({
        dayOfWeek,
        fromDate: fromDate.toDate(),
        toDate: toDate.toDate(),
        text,
      });

      console.log(res.date);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <h1>Tweet</h1>
      <TextField
        multiline
        variant="outlined"
        label="Tweet内容"
        rows={5}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <br />
      <Input
        type="time"
        value={fromTime.format("HH:mm")}
        onChange={(e) => {
          console.log(e.currentTarget.value);
          const [hour, min] = e.currentTarget.value.split(":");
          setFromTime((prev) => prev.hour(Number(hour)).minute(Number(min)));
        }}
      />
      〜
      <Input
        type="time"
        value={toTime.format("HH:mm")}
        onChange={(e) => {
          const [hour, min] = e.currentTarget.value.split(":");
          setToTime((prev) => prev.hour(Number(hour)).minute(Number(min)));
        }}
      />
      <br />
      <Select
        value={dayOfWeek}
        label="曜日"
        onChange={(e) => {
          const value = e.target.value;
          if (typeof value === "number") {
            setDayOfWeek(value);
          }
        }}
      >
        <MenuItem value={DAY_OF_WEEK.SUM}>日</MenuItem>
        <MenuItem value={DAY_OF_WEEK.MON}>月</MenuItem>
        <MenuItem value={DAY_OF_WEEK.TUE}>火</MenuItem>
        <MenuItem value={DAY_OF_WEEK.WED}>水</MenuItem>
        <MenuItem value={DAY_OF_WEEK.THU}>木</MenuItem>
        <MenuItem value={DAY_OF_WEEK.FRI}>金</MenuItem>
        <MenuItem value={DAY_OF_WEEK.SAT}>土</MenuItem>
      </Select>
      <br />
      <button onClick={create}>作成</button>
    </div>
  );
};

export default Page;
