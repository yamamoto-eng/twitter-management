import { router } from "@/server/trpc";
import { create } from "./create";
import { list } from "./list";
import { deleteById } from "./deleteById";

export const tweet = router({
  create,
  list,
  deleteById,
});
