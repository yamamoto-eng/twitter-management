import { procedure } from "@/server/trpc";
import { tokenRevoke } from "@/server/services/tokenRevoke";
import { credentialsRepository } from "@/server/db/credentialsRepository";

export const logout = procedure.mutation(async ({ ctx }) => {
  try {
    const { accessToken } = await credentialsRepository().readCredentials({ id: ctx.session.id });
    const { data } = await tokenRevoke({ accessToken });

    if (!data.revoked) {
      return { success: false };
    }

    await ctx.session.destroy();
    return { success: true };
  } catch {
    return { success: false };
  }
});
