import { trpc } from "@/utils";
import { Button, Dialog, Input, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { ComponentProps, FC, useState } from "react";
import dayjs from "dayjs";
import { notification } from "@/utils/notification";
import { Interval } from "@/schema/dateTime";
import { DATE_TYPE, DATE_TYPE_LABEL, DAY, DAY_OF_WEEK, DAY_OF_WEEK_LABEL } from "@/constants";
import { useCacheOfScheduledTweetList } from "@/hooks/useCacheOfScheduledTweetList";

type Props = ComponentProps<typeof Dialog>;

export const CreateDialog: FC<Props> = (props) => {
  if (!props.open) return null;
  return <_CreateDialog {...props} />;
};

const _CreateDialog: FC<Props> = (props) => {
  const { addScheduledTweet } = useCacheOfScheduledTweetList();
  const { mutateAsync } = trpc.scheduledTweet.create.useMutation();

  const [text, setText] = useState("");
  const [interval, setInterval] = useState<Interval>({ type: "day", day: 1 });
  const [fromTime, setFromTime] = useState(dayjs());
  const [toTime, setToTime] = useState(dayjs());
  const [isEnabled, setIsEnabled] = useState(false);
  const [scheduledDeletionDay, setScheduledDeletionDay] = useState<(typeof DAY)[keyof typeof DAY] | 0>(0);

  const onCreateTweet = async () => {
    const { scheduledTweet } = await mutateAsync({
      fromTime: fromTime.toDate(),
      toTime: toTime.toDate(),
      text,
      isEnabled,
      interval,
      scheduledDeletionDay: scheduledDeletionDay || null,
    });

    addScheduledTweet(scheduledTweet);
    notification("Tweetを作成しました");
  };

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
      <Select
        value={interval.type}
        onChange={(e) => {
          const type = e.target.value as Interval["type"];
          if (type === "day") {
            setInterval({ type, day: DAY.ONE });
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
                {`${value}日`}
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
      <InputLabel>Tweetを自動削除</InputLabel>
      <Select
        value={scheduledDeletionDay}
        onChange={(e) => {
          const value = e.target.value;
          if (typeof value === "number") {
            setScheduledDeletionDay(value);
          }
        }}
      >
        {Object.values({ _: 0, ...DAY }).map((value, index) => (
          <MenuItem key={index} value={value}>
            {value ? `${value}日後` : "削除しない"}
          </MenuItem>
        ))}
      </Select>
      <Switch checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
      <Button onClick={onCreateTweet} variant="contained">
        作成
      </Button>
    </Dialog>
  );
};
