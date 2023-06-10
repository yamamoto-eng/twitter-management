import { trpc } from "@/utils";
import { GetServerSideProps, NextPage } from "next";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from "@mui/material/";
import dayjs from "dayjs";
import { DATE_TYPE_LABEL, DAY_LABEL, DAY_OF_WEEK_LABEL } from "@/constants";
import { Tweet } from "@/schema/tweet";
import { trpcHelper } from "@/server/routers/_app";
import Link from "next/link";
import { CreateDialog } from "@/components/pages/tweet/CreateDialog";
import { useRouter } from "next/router";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/pages/tweet/DeleteDialog";

const DIALOG_TYPE = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const;

const Page: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const tweetListKey = getQueryKey(trpc.tweet.list, undefined, "query");
  const data = queryClient.getQueryData<{ tweetList: Tweet[] }>(tweetListKey);

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
              <TableCell align="center" width={10}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.tweetList.map((tweet) => (
              <TableRow key={tweet.ebId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="tweet">
                  {tweet.text}
                </TableCell>
                {tweet.interval.type === "day" && (
                  <TableCell align="center">
                    {DATE_TYPE_LABEL[tweet.interval.type]}/{DAY_LABEL[tweet.interval.day]}
                  </TableCell>
                )}
                {tweet.interval.type === "dayOfWeek" && (
                  <TableCell align="center">
                    {DATE_TYPE_LABEL[tweet.interval.type]}/{DAY_OF_WEEK_LABEL[tweet.interval.dayOfWeek]}
                  </TableCell>
                )}
                <TableCell align="center">
                  {dayjs(tweet.fromDate).format("HH:mm")}~{dayjs(tweet.toDate).format("HH:mm")}
                </TableCell>
                <TableCell align="center">{tweet.isEnabled ? "有効" : "無効"}</TableCell>
                <TableCell align="center">
                  <Link href={{ query: { type: DIALOG_TYPE.DELETE, id: tweet.ebId } }} shallow>
                    <Button>削除</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateDialog open={router.query["type"] === DIALOG_TYPE.CREATE} onClose={onCloseDialog} />
      <DeleteDialog open={router.query["type"] === DIALOG_TYPE.DELETE} onClose={onCloseDialog} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const helpers = await trpcHelper(ctx);
  await helpers.tweet.list.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};

export default Page;
