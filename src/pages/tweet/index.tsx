import { trpc } from "@/utils";
import { NextPage } from "next";
import {
  Button,
  Input,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material/";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DayOfWeek } from "@/schema/dateTime";
import { DAY_OF_WEEK } from "@/constants";
import { Tweet } from "@/schema/tweet";
import { aleat } from "@/utils/alert";

const Page: NextPage = () => {
  const { mutateAsync } = trpc.tweet.create.useMutation();
  const { data } = trpc.tweet.list.useQuery();
  const { mutateAsync: deleteByIdMutateAsync } = trpc.tweet.deleteById.useMutation();

  const [tweetList, setTweetList] = useState<Tweet[]>([]);
  const [text, setText] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(dayjs().day() as DayOfWeek);
  const [fromTime, setFromTime] = useState(dayjs());
  const [toTime, setToTime] = useState(dayjs());
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (data) {
      setTweetList(data.tweetList);
    }
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
      const { tweet } = await mutateAsync({
        fromDate: fromDate.toDate(),
        toDate: toDate.toDate(),
        text,
        isEnabled,
      });

      setTweetList((prev) => [...prev, tweet]);
      aleat("Tweetを作成しました");
    } catch (e) {
      console.log(e);
    }
  };

  const deleteById = async (id: string) => {
    const { tweetList } = await deleteByIdMutateAsync({ ebId: id });
    setTweetList(tweetList);
    aleat("Tweetを削除しました");
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
      <h2>Tweet List</h2>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">投稿内容</TableCell>
              <TableCell align="center" width={80}>
                曜日
              </TableCell>
              <TableCell align="center" width={120}>
                時間帯
              </TableCell>
              <TableCell align="center" width={120}>
                ステータス
              </TableCell>
              <TableCell align="center" width={10}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tweetList?.map((tweet) => (
              <TableRow key={tweet.ebId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="tweet">
                  {tweet.text}
                </TableCell>
                <TableCell align="center">{dayjs(tweet.fromDate).format("dd")}</TableCell>
                <TableCell align="center">
                  {dayjs(tweet.fromDate).format("HH:mm")}~{dayjs(tweet.toDate).format("HH:mm")}
                </TableCell>
                <TableCell align="center">{tweet.isEnabled ? "有効" : "無効"}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => deleteById(tweet.ebId)}>削除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Page;
