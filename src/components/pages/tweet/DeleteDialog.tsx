import { trpc } from "@/utils";
import { Button, Dialog } from "@mui/material";
import { ComponentProps, FC } from "react";
import dayjs from "dayjs";
import { notification } from "@/utils/notification";
import { DATE_TYPE_LABEL, DAY_OF_WEEK_LABEL } from "@/constants";
import { useRouter } from "next/router";
import { useCacheOfScheduledTweetList } from "@/hooks/useCacheOfScheduledTweetList";

type Props = ComponentProps<typeof Dialog>;

export const DeleteDialog: FC<Props> = (props) => {
  if (!props.open) return null;
  return <_DeleteDialog {...props} />;
};

const _DeleteDialog: FC<Props> = (props) => {
  const router = useRouter();
  const { getScheduledTweet, removeScheduledTweet } = useCacheOfScheduledTweetList();
  const { mutateAsync } = trpc.scheduledTweet.remove.useMutation();

  const id = router.query["id"] as string;
  const { scheduledTweet } = getScheduledTweet(id);

  const onRemoveTweet = async () => {
    const { scheduledTweet } = await mutateAsync({ ebId: id });
    removeScheduledTweet(scheduledTweet.ebId);
    notification("Tweetを削除しました");
  };

  if (!scheduledTweet) return null;

  return (
    <Dialog {...props}>
      <p>{scheduledTweet.text}</p>
      <br />
      <p>{dayjs(scheduledTweet.fromDate).format("HH:mm")}</p>〜<p>{dayjs(scheduledTweet.toDate).format("HH:mm")}</p>
      <br />
      <p>種別</p>
      <p>{DATE_TYPE_LABEL[scheduledTweet.interval.type]}</p>
      {scheduledTweet.interval.type === "day" && <p>{`${scheduledTweet.interval.day}日`}</p>}
      {scheduledTweet.interval.type === "dayOfWeek" && <p>{DAY_OF_WEEK_LABEL[scheduledTweet.interval.dayOfWeek]}</p>}
      <br />
      <p>{scheduledTweet.isEnabled ? "有効" : "無効"}</p>
      <Button onClick={onRemoveTweet} variant="contained">
        削除
      </Button>
    </Dialog>
  );
};
