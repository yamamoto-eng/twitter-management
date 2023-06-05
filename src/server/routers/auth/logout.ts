import { procedure } from "@/server/trpc";
import { tokenRevoke } from "@/server/services";
import { credentialsRepository } from "@/server/db";

export const logout = procedure.mutation(async ({ ctx }) => {
  const { readCredentials } = credentialsRepository(ctx.session.id);

  try {
    const credentials = await readCredentials();

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
