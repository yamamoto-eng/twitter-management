import { procedure } from "@/server/trpc";

export const check = procedure.query(({ ctx }) => {
  const isAuth = !!ctx.session.accessToken;

  return { isAuth };
});
