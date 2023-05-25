import { router } from "@/server/trpc";
import { login } from "./login";
import { callback } from "./callback";
import { logout } from "./logout";

export const auth = router({
  login,
  callback,
  logout,
});
