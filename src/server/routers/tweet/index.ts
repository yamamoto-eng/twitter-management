import { router } from "@/server/trpc";
import { create } from "./create";
import { list } from "./list";

export const tweet = router({
  create,
  list,
});
