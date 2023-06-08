import { trpc } from "@/utils";
import { GetServerSideProps, NextPage } from "next";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  TextField,
} from "@mui/material/";
import dayjs from "dayjs";
import { useState } from "react";
import { DateInterval } from "@/schema/dateTime";
import { DATE_INTERVAL, DATE_INTERVAL_LABEL } from "@/constants";
import { Tweet } from "@/schema/tweet";
import { notification } from "@/utils/notification";
import { useEffectOnce } from "react-use";
import { trpcHelper } from "@/server/routers/_app";

type Props = {
  tweetList: Tweet[];
};

const Page: NextPage<Props> = (props) => {
  const { mutateAsync } = trpc.tweet.create.useMutation();
  const { mutateAsync: deleteByIdMutateAsync } = trpc.tweet.deleteById.useMutation();

  const [tweetList, setTweetList] = useState<Tweet[]>([]);
  const [text, setText] = useState("");
  const [dateInterval, setDateInterval] = useState<DateInterval>(DATE_INTERVAL.DAY_ONE);
  const [fromTime, setFromTime] = useState(dayjs());
  const [toTime, setToTime] = useState(dayjs());
  const [isEnabled, setIsEnabled] = useState(false);

  useEffectOnce(() => {
    setTweetList(props.tweetList);
  });

  const create = async () => {
    try {
      const { tweet } = await mutateAsync({
        fromTime: fromTime.toDate(),
        toTime: toTime.toDate(),
        text,
        isEnabled,
        dateInterval,
      });
      setTweetList((prev) => [...prev, tweet]);
      notification("Tweetを作成しました");
    } catch (e) {
      console.log(e);
    }
  };

  const deleteById = async (id: string) => {
    const { tweetList } = await deleteByIdMutateAsync({ ebId: id });
    setTweetList(tweetList);
    notification("Tweetを削除しました");
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
      <FormControl sx={{ margin: 3 }}>
        <InputLabel id="date-interval">頻度</InputLabel>
        <Select
          labelId="date-interval"
          id="date-interval"
          value={dateInterval}
          label="頻度"
          onChange={(e) => {
            const value = e.target.value;
            if (typeof value === "number") {
              setDateInterval(value);
            }
          }}
        >
          {Object.values(DATE_INTERVAL).map((value, index) => (
            <MenuItem key={index} value={value}>
              {DATE_INTERVAL_LABEL[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <Switch checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
      <Button onClick={create} variant="contained">
        作成
      </Button>
      <Divider sx={{ marginTop: 3, marginBottom: 10 }} />
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

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const helpers = await trpcHelper(ctx);
  const { tweetList } = await helpers.tweet.list.fetch();

  return { props: { tweetList } };
};

export default Page;
