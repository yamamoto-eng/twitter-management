import { trpc } from "@/utils";
import { GetServerSideProps, NextPage } from "next";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material/";
import dayjs from "dayjs";
import { DATE_TYPE_LABEL, DAY_LABEL, DAY_OF_WEEK_LABEL } from "@/constants";
import { Tweet } from "@/schema/tweet";
import { notification } from "@/utils/notification";
import { useEffectOnce } from "react-use";
import { trpcHelper } from "@/server/routers/_app";
import Link from "next/link";
import { CreateDialog } from "@/components/pages/tweet/CreateDialog";
import { useRouter } from "next/router";

const DIALOG_TYPE = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const;

type Props = {
  tweetList: Tweet[];
};

const Page: NextPage<Props> = ({ tweetList }) => {
  const router = useRouter();
  const { mutateAsync: deleteByIdMutateAsync } = trpc.tweet.deleteById.useMutation();

  const deleteById = async (id: string) => {
    await deleteByIdMutateAsync({ ebId: id });
    notification("Tweetを削除しました");
  };

  return (
    <div>
      <h1>Tweet</h1>
      <Link href={{ query: { type: DIALOG_TYPE.CREATE } }} shallow>
        <Button variant="contained">新規作成</Button>
      </Link>
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
            {tweetList?.map((tweet) => (
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
                  <Button onClick={() => deleteById(tweet.ebId)}>削除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {router.query["type"] === DIALOG_TYPE.CREATE && <CreateDialog />}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const helpers = await trpcHelper(ctx);
  const { tweetList } = await helpers.tweet.list.fetch();

  return { props: { tweetList } };
};

export default Page;
