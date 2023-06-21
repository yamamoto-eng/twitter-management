import { router } from "@/server/trpc";
import { list } from "./list";
import { cancel } from "./cancel";

export const executedTweet = router({
  list,
  cancel,
});
