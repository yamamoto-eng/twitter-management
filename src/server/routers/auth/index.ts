import { router } from "@/server/trpc";
import { login } from "./login";

export const auth = router({
  login,
});
