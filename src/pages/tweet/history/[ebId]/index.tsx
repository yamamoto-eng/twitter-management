import { trpcHelper } from "@/server/routers/_app";
import { GetServerSideProps, NextPage } from "next";
import dayjs from "dayjs";
import { useUserInfoWithStorage } from "@/hooks/useUserInfoWithStorage";
import { Button } from "@mui/material";
import { trpc } from "@/utils";
import { notification } from "@/utils/notification";
import { Output as ExecutedTweetByIdOutput } from "@/schema/executedTweet/byId";
import { useState } from "react";
import { useEffectOnce } from "react-use";
import { Output as ScheduledTweetByIdOutput } from "@/schema/scheduledTweet/byId";
import { DATE_TYPE_LABEL, DAY_OF_WEEK_LABEL } from "@/constants";

type Props = {
  executedTweetList: ExecutedTweetByIdOutput["executedTweetList"];
  scheduledTweet: ScheduledTweetByIdOutput["scheduledTweet"];
};

const Index: NextPage<Props> = (props) => {
  const { userInfo } = useUserInfoWithStorage();
  const { mutateAsync } = trpc.executedTweet.cancel.useMutation();

  const [executedTweetList, setExecutedTweetList] = useState<ExecutedTweetByIdOutput["executedTweetList"]>([]);

  useEffectOnce(() => {
    setExecutedTweetList(props.executedTweetList);
  });

  const onCancel = async (ebId: string) => {
    await mutateAsync({ ebId }).then((res) => {
      notification("ツイートの自動削除を取り消しました。");
      setExecutedTweetList((prev) =>
        prev.map((item) => (item.ebId === res.executedTweet.ebId ? res.executedTweet : item))
      );
    });
  };

  return (
    <div>
      <h1>履歴</h1>
      <div>
        <p>投稿内容: {props.scheduledTweet.text}</p>
        {props.scheduledTweet.interval.type === "day" && (
          <p>
            種別/頻度: {DATE_TYPE_LABEL[props.scheduledTweet.interval.type]}/{`${props.scheduledTweet.interval.day}日`}
          </p>
        )}
        {props.scheduledTweet.interval.type === "dayOfWeek" && (
          <p>
            種別/頻度: {DATE_TYPE_LABEL[props.scheduledTweet.interval.type]}/
            {DAY_OF_WEEK_LABEL[props.scheduledTweet.interval.dayOfWeek]}
          </p>
        )}
        <p>
          時間帯: {dayjs(props.scheduledTweet.fromDate).format("HH:mm")}~
          {dayjs(props.scheduledTweet.toDate).format("HH:mm")}
        </p>
        <p>ステータス:{props.scheduledTweet.isEnabled ? "有効" : "無効"}</p>
        <p>
          Tweetを自動削除:
          {props.scheduledTweet.scheduledDeletionDay
            ? `${props.scheduledTweet.scheduledDeletionDay}日後`
            : "削除しない"}
        </p>
        <p>作成日: {dayjs(props.scheduledTweet.createdAt).format("YYYY/MM/DD")}</p>
      </div>

      <br />

      {executedTweetList.map(({ ebId, text, tweetedAt, tweetId, scheduledDeletionDate }) => (
        <div key={tweetId} style={{ marginBottom: "20px" }}>
          <p>ツイート内容：{text}</p>
          <p>ツイート日時：{dayjs(tweetedAt).format("YYYY/MM/DD HH:mm")}</p>
          <p>
            ツイートの削除日時：
            {scheduledDeletionDate ? `${dayjs(scheduledDeletionDate).format("YYYY/MM/DD HH:mm")}` : "-"}
          </p>
          {scheduledDeletionDate && (
            <Button
              onClick={() => {
                onCancel(ebId);
              }}
            >
              ツイートの自動削除を取り消す
            </Button>
          )}
          {userInfo.isLogin && (
            <a
              href={`https://twitter.com/${userInfo.userName}/status/${tweetId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
            >
              Tweet URL
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const ebId = ctx.query["ebId"] as string;
  const helpers = await trpcHelper(ctx);
  const { executedTweetList } = await helpers.executedTweet.byId.fetch({ scheduledEbId: ebId });
  const { scheduledTweet } = await helpers.scheduledTweet.byId.fetch({ ebId });

  return {
    props: {
      executedTweetList,
      scheduledTweet,
    },
  };
};

export default Index;
