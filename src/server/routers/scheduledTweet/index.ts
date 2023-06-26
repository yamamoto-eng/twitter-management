import { router } from "@/server/trpc";
import { create } from "./create";
import { list } from "./list";
import { remove } from "./remove";
import { update } from "./update";
import { byId } from "./byId";

export const scheduledTweet = router({
  create,
  list,
  remove,
  update,
  byId,
});
