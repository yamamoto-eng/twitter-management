import { trpc } from "@/utils";
import { NextPage } from "next";
import { Button, Input, MenuItem, Select, Switch, TextField } from "@mui/material/";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DayOfWeek } from "@/schema/dateTime";
import { DAY_OF_WEEK } from "@/constants";
import { Tweet } from "@/schema/tweet";

const Page: NextPage = () => {
  const { mutateAsync } = trpc.tweet.create.useMutation();
  const { data } = trpc.tweet.list.useQuery();
  const { mutateAsync: deleteByIdMutateAsync } = trpc.tweet.deleteById.useMutation();

  const [tweetList, setTweetList] = useState<Tweet[]>();
  const [text, setText] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(dayjs().day() as DayOfWeek);
  const [fromTime, setFromTime] = useState(dayjs());
  const [toTime, setToTime] = useState(dayjs());
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setTweetList(data?.tweetList);
  }, [data]);

  const create = async () => {
    let fromDate = fromTime.day(dayOfWeek);
    let toDate = toTime.day(dayOfWeek);

    if (fromDate.isAfter(toDate)) {
      toDate = toDate.add(1, "day");
    }

    if (fromDate.isBefore(dayjs())) {
      fromDate = fromDate.add(7, "day");
      toDate = toDate.add(7, "day");
    }

    try {
      const res = await mutateAsync({
        fromDate: fromDate.toDate(),
        toDate: toDate.toDate(),
        text,
        isEnabled,
      });

      console.log(res.date);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteById = async (id: string) => {
    const { tweetList } = await deleteByIdMutateAsync({ ebId: id });
    setTweetList(tweetList);
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
      <Switch checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
      <button onClick={create}>作成</button>
      <div>
        <h2>Tweet List</h2>
        {tweetList?.map((tweet) => (
          <div key={tweet.ebId} style={{ margin: "20px 0" }}>
            <p>Tweet内容: {tweet.text}</p>
            <p>曜日: {dayjs(tweet.fromDate).format("dd")}</p>
            <p>
              時間: {dayjs(tweet.fromDate).format("HH:mm")}~{dayjs(tweet.toDate).format("HH:mm")}
            </p>
            <p>有効: {tweet.isEnabled ? "有効" : "無効"}</p>
            <Button onClick={() => deleteById(tweet.ebId)}>削除</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
