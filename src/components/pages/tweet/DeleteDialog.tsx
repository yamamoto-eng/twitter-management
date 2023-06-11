import { trpc } from "@/utils";
import { Button, Dialog } from "@mui/material";
import { ComponentProps, FC } from "react";
import dayjs from "dayjs";
import { notification } from "@/utils/notification";
import { DATE_TYPE_LABEL, DAY_LABEL, DAY_OF_WEEK_LABEL } from "@/constants";
import { useRouter } from "next/router";
import { useCacheOfTweetList } from "@/hooks/useCacheOfTweetList";

type Props = ComponentProps<typeof Dialog>;

export const DeleteDialog: FC<Props> = (props) => {
  if (!props.open) return null;
  return <_DeleteDialog {...props} />;
};

const _DeleteDialog: FC<Props> = (props) => {
  const router = useRouter();
  const { getTweet, removeTweet } = useCacheOfTweetList();
  const { mutateAsync } = trpc.tweet.deleteById.useMutation();

  const id = router.query["id"] as string;
  const { tweet } = getTweet(id);

  const onRemoveTweet = async () => {
    const { tweet } = await mutateAsync({ ebId: id });
    removeTweet(tweet.ebId);
    notification("Tweetを削除しました");
  };

  if (!tweet) return null;

  return (
    <Dialog {...props}>
      <p>{tweet.text}</p>
      <br />
      <p>{dayjs(tweet.fromDate).format("HH:mm")}</p>〜<p>{dayjs(tweet.toDate).format("HH:mm")}</p>
      <br />
      <p>種別</p>
      <p>{DATE_TYPE_LABEL[tweet.interval.type]}</p>
      {tweet.interval.type === "day" && <p>{DAY_LABEL[tweet.interval.day]}</p>}
      {tweet.interval.type === "dayOfWeek" && <p>{DAY_OF_WEEK_LABEL[tweet.interval.dayOfWeek]}</p>}
      <br />
      <p>{tweet.isEnabled ? "有効" : "無効"}</p>
      <Button onClick={onRemoveTweet} variant="contained">
        削除
      </Button>
    </Dialog>
  );
};
