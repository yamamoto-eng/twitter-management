import { useCacheOfExecutedTweetList } from "@/hooks/useCacheOfExecutedTweetList";
import { trpcHelper } from "@/server/routers/_app";
import { GetServerSideProps, NextPage } from "next";
import dayjs from "dayjs";
import { useUserInfoWithStorage } from "@/hooks/useUserInfoWithStorage";
import { Button } from "@mui/material";

const Index: NextPage = () => {
  const { getExecutedTweetList } = useCacheOfExecutedTweetList();
  const { executedTweetList } = getExecutedTweetList();
  const { userInfo } = useUserInfoWithStorage();

  return (
    <div>
      <h1>履歴</h1>

      {executedTweetList.map(({ text, tweetedAt, tweetId, scheduledDeletionDate }) => (
        <div key={tweetId} style={{ marginBottom: "20px" }}>
          <p>ツイート内容：{text}</p>
          <p>ツイート日時：{dayjs(tweetedAt).format("YYYY/MM/DD HH:mm")}</p>
          <p>
            ツイートの削除日時：
            {scheduledDeletionDate ? `${dayjs(scheduledDeletionDate).format("YYYY/MM/DD HH:mm")}` : "-"}
          </p>
          {dayjs(scheduledDeletionDate).isAfter(dayjs()) && <Button>ツイートの自動削除を取り消す</Button>}
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
  const helpers = await trpcHelper(ctx);
  await helpers.executedTweet.list.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};

export default Index;
