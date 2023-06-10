import { trpc } from "@/utils";
import { Button, Dialog } from "@mui/material";
import { ComponentProps, FC } from "react";
import dayjs from "dayjs";
import { notification } from "@/utils/notification";
import { DATE_TYPE_LABEL, DAY_LABEL, DAY_OF_WEEK_LABEL } from "@/constants";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Tweet } from "@/schema/tweet";
import { useRouter } from "next/router";

type Props = ComponentProps<typeof Dialog>;

export const DeleteDialog: FC<Props> = (props) => {
  if (!props.open) return null;
  return <_DeleteDialog {...props} />;
};

const _DeleteDialog: FC<Props> = (props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync } = trpc.tweet.deleteById.useMutation();

  const id = router.query["id"] as string;
  const tweetListKey = getQueryKey(trpc.tweet.list, undefined, "query");
  const data = queryClient.getQueryData<{ tweetList: Tweet[] }>(tweetListKey);
  const tweet = data?.tweetList.find((tweet) => tweet.ebId === id);

  const deleteTweet = async () => {
    const { tweetList } = await mutateAsync({ ebId: id });
    queryClient.setQueryData<{ tweetList: Tweet[] }>(tweetListKey, { tweetList });
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
      <Button onClick={deleteTweet} variant="contained">
        削除
      </Button>
    </Dialog>
  );
};
