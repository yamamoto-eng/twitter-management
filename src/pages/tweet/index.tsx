import { GetServerSideProps, NextPage } from "next";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from "@mui/material/";
import dayjs from "dayjs";
import { DATE_TYPE_LABEL, DAY_OF_WEEK_LABEL } from "@/constants";
import { trpcHelper } from "@/server/routers/_app";
import Link from "next/link";
import { CreateDialog } from "@/components/pages/tweet/CreateDialog";
import { useRouter } from "next/router";
import { DeleteDialog } from "@/components/pages/tweet/DeleteDialog";
import { UpdateDialog } from "@/components/pages/tweet/UpdateDialog";
import { useCacheOfScheduledTweetList } from "@/hooks/useCacheOfScheduledTweetList";

const DIALOG_TYPE = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const;

const Page: NextPage = () => {
  const router = useRouter();
  const { getScheduledTweetList } = useCacheOfScheduledTweetList();
  const { scheduledTweetList } = getScheduledTweetList();

  const onCloseDialog = () => {
    router.push(
      {
        query: {},
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div>
      <h1>Tweet</h1>
      <Link href={{ query: { type: DIALOG_TYPE.CREATE } }} shallow>
        <Button variant="contained">新規作成</Button>
      </Link>
      <Divider sx={{ margin: "30px 0" }} />
      <h2>Tweet List</h2>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">投稿内容</TableCell>
              <TableCell align="center" width={120}>
                種別/頻度
              </TableCell>
              <TableCell align="center" width={120}>
                時間帯
              </TableCell>
              <TableCell align="center" width={120}>
                ステータス
              </TableCell>
              <TableCell align="center" width={120}>
                Tweetを自動削除
              </TableCell>
              <TableCell align="center" width={120}>
                作成日
              </TableCell>
              <TableCell align="center" width={10}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduledTweetList.map((scheduledTweet) => (
              <TableRow key={scheduledTweet.ebId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th">{scheduledTweet.text}</TableCell>
                {scheduledTweet.interval.type === "day" && (
                  <TableCell align="center">
                    {DATE_TYPE_LABEL[scheduledTweet.interval.type]}/{`${scheduledTweet.interval.day}日`}
                  </TableCell>
                )}
                {scheduledTweet.interval.type === "dayOfWeek" && (
                  <TableCell align="center">
                    {DATE_TYPE_LABEL[scheduledTweet.interval.type]}/
                    {DAY_OF_WEEK_LABEL[scheduledTweet.interval.dayOfWeek]}
                  </TableCell>
                )}
                <TableCell align="center">
                  {dayjs(scheduledTweet.fromDate).format("HH:mm")}~{dayjs(scheduledTweet.toDate).format("HH:mm")}
                </TableCell>
                <TableCell align="center">{scheduledTweet.isEnabled ? "有効" : "無効"}</TableCell>
                <TableCell align="center">
                  {scheduledTweet.scheduledDeletionDay ? `${scheduledTweet.scheduledDeletionDay}日後` : "削除しない"}
                </TableCell>
                <TableCell align="center">{dayjs(scheduledTweet.createdAt).format("YYYY/MM/DD")}</TableCell>
                <TableCell align="center">
                  <Link href={{ query: { type: DIALOG_TYPE.UPDATE, id: scheduledTweet.ebId } }} shallow>
                    <Button>編集</Button>
                  </Link>
                  <Link href={{ query: { type: DIALOG_TYPE.DELETE, id: scheduledTweet.ebId } }} shallow>
                    <Button>削除</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateDialog open={router.query["type"] === DIALOG_TYPE.CREATE} onClose={onCloseDialog} />
      <UpdateDialog open={router.query["type"] === DIALOG_TYPE.UPDATE} onClose={onCloseDialog} />
      <DeleteDialog open={router.query["type"] === DIALOG_TYPE.DELETE} onClose={onCloseDialog} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const helpers = await trpcHelper(ctx);
  await helpers.scheduledTweet.list.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};

export default Page;
