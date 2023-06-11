import { trpc } from "@/utils";
import { Button, Dialog, Input, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { ComponentProps, FC, useLayoutEffect, useState } from "react";
import dayjs from "dayjs";
import { notification } from "@/utils/notification";
import { Interval } from "@/schema/dateTime";
import { DATE_TYPE, DATE_TYPE_LABEL, DAY, DAY_LABEL, DAY_OF_WEEK, DAY_OF_WEEK_LABEL } from "@/constants";
import { useRouter } from "next/router";
import { useCacheOfTweetList } from "@/hooks/useCacheOfTweetList";

type Props = ComponentProps<typeof Dialog>;

export const UpdateDialog: FC<Props> = (props) => {
  if (!props.open) return null;
  return <_UpdateDialog {...props} />;
};

const _UpdateDialog: FC<Props> = (props) => {
  const router = useRouter();
  const { getTweet, updateTweet } = useCacheOfTweetList();
  const { mutateAsync } = trpc.tweet.updateById.useMutation();

  const id = router.query["id"] as string;
  const { tweet } = getTweet(id);

  const [text, setText] = useState("");
  const [interval, setInterval] = useState<Interval>({ type: "day", day: 1 });
  const [fromTime, setFromTime] = useState(dayjs());
  const [toTime, setToTime] = useState(dayjs());
  const [isEnabled, setIsEnabled] = useState(false);

  useLayoutEffect(() => {
    if (tweet) {
      setText(tweet.text);
      setInterval(tweet.interval);
      setFromTime(dayjs(tweet.fromDate));
      setToTime(dayjs(tweet.toDate));
      setIsEnabled(tweet.isEnabled);
    }
  }, [tweet]);

  const onUpdateTweet = async () => {
    const { tweet } = await mutateAsync({
      ebId: id,
      fromTime: fromTime.toDate(),
      toTime: toTime.toDate(),
      text,
      isEnabled,
      interval,
    });

    updateTweet(tweet);
    notification("Tweetを更新しました");
  };

  if (!tweet) return null;

  return (
    <Dialog {...props}>
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
      <InputLabel>種別</InputLabel>
      <Select<Interval["type"]>
        value={interval.type}
        onChange={(e) => {
          const type = e.target.value as Interval["type"];
          if (type === "day") {
            setInterval({ type, day: DAY.DAY_ONE });
          }
          if (type === "dayOfWeek") {
            setInterval({ type, dayOfWeek: DAY_OF_WEEK.MON });
          }
        }}
      >
        {Object.values(DATE_TYPE).map((value, index) => (
          <MenuItem key={index} value={value}>
            {DATE_TYPE_LABEL[value]}
          </MenuItem>
        ))}
      </Select>
      {interval.type === "day" && (
        <>
          <InputLabel>頻度</InputLabel>
          <Select
            value={interval.day}
            onChange={(e) => {
              const value = e.target.value;
              if (typeof value === "number") {
                setInterval({ type: "day", day: value });
              }
            }}
          >
            {Object.values(DAY).map((value, index) => (
              <MenuItem key={index} value={value}>
                {DAY_LABEL[value]}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
      {interval.type === "dayOfWeek" && (
        <>
          <InputLabel>頻度</InputLabel>
          <Select
            value={interval.dayOfWeek}
            onChange={(e) => {
              const value = e.target.value;
              if (typeof value === "number") {
                setInterval({ type: "dayOfWeek", dayOfWeek: value });
              }
            }}
          >
            {Object.values(DAY_OF_WEEK).map((value, index) => (
              <MenuItem key={index} value={value}>
                {DAY_OF_WEEK_LABEL[value]}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
      <br />
      <Switch checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
      <Button onClick={onUpdateTweet} variant="contained">
        保存
      </Button>
    </Dialog>
  );
};
