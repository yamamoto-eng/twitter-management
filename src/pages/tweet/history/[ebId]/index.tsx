import { useCacheOfExecutedTweetList } from "@/hooks/useCacheOfExecutedTweetList";
import { trpcHelper } from "@/server/routers/_app";
import { GetServerSideProps, NextPage } from "next";
import dayjs from "dayjs";
import { useUserInfoWithStorage } from "@/hooks/useUserInfoWithStorage";
import { Button } from "@mui/material";
import { trpc } from "@/utils";
import { notification } from "@/utils/notification";
import { Output } from "@/schema/executedTweet/byId";
import { useState } from "react";
import { useEffectOnce } from "react-use";

type Props = {
  executedTweetList: Output["executedTweetList"];
};

const Index: NextPage<Props> = (props) => {
  const { userInfo } = useUserInfoWithStorage();
  const { mutateAsync } = trpc.executedTweet.cancel.useMutation();

  const [executedTweetList, setExecutedTweetList] = useState<Output["executedTweetList"]>([]);

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ebId = ctx.query["ebId"] as string;
  const helpers = await trpcHelper(ctx);
  const { executedTweetList } = await helpers.executedTweet.byId.fetch({ scheduledEbId: ebId });

  return {
    props: {
      executedTweetList,
    },
  };
};

export default Index;
