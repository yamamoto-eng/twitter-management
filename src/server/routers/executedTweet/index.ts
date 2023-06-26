import { router } from "@/server/trpc";
import { list } from "./list";
import { cancel } from "./cancel";
import { byId } from "./byId";

export const executedTweet = router({
  list,
  cancel,
  byId,
});
