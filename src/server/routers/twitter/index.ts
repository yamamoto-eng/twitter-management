import { router } from "@/server/trpc";
import { tweet } from "./tweet";

export const twitter = router({
  tweet,
});
