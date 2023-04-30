import { router } from "@/server/trpc";
import { login } from "./login";
import { check } from "./check";
import { callback } from "./callback";
import { logout } from "./logout";

export const auth = router({
  login,
  check,
  callback,
  logout,
});
