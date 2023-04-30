import { procedure } from "@/server/trpc";
import axios from "axios";
import { auth } from "@/server/utils";

const endPoint = "https://api.twitter.com/2/oauth2/revoke";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Basic ${auth}`,
};

export const logout = procedure.mutation(async ({ ctx }) => {
  const session = ctx.session;

  try {
    await axios.post(
      endPoint,
      {
        token: session.accessToken,
        token_type_hint: "access_token",
      },
      { headers }
    );
    await session.destroy();
    return { success: true };
  } catch {
    return { success: false };
  }
});
