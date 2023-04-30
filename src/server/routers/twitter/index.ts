import { router } from "@/server/trpc";
import { tweet } from "./tweet";
import { me } from "./me";

export const twitter = router({
  tweet,
  me,
});
