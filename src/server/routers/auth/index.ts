import { router } from "@/server/trpc";
import { login } from "./login";
import { check } from "./check";

export const auth = router({
  login,
  check,
});
