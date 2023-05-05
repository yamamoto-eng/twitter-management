import { procedure } from "@/server/trpc";
import { tokenRevoke } from "@/server/services/tokenRevoke";

export const logout = procedure.mutation(async ({ ctx }) => {
  try {
    const { data } = await tokenRevoke({ accessToken: ctx.session.accessToken });

    if (!data.revoked) {
      return { success: false };
    }

    await ctx.session.destroy();
    return { success: true };
  } catch {
    return { success: false };
  }
});
