import { procedure } from "@/server/trpc";
import { tokenRevoke } from "@/server/services/tokenRevoke";
import { credentialsRepository } from "@/server/db/credentialsRepository";

export const logout = procedure.mutation(async ({ ctx }) => {
  try {
    const credentials = await credentialsRepository().readCredentials({ id: ctx.session.id });

    if (!credentials) {
      return { success: false };
    }

    const { data } = await tokenRevoke({ accessToken: credentials.accessToken });

    if (!data.revoked) {
      return { success: false };
    }

    await ctx.session.destroy();
    return { success: true };
  } catch {
    return { success: false };
  }
});
