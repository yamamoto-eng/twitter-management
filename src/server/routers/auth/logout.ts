import { procedure } from "@/server/trpc";
import { tokenRevoke } from "@/server/services";
import { credentialRepository } from "@/server/db";

export const logout = procedure.mutation(async ({ ctx }) => {
  const { find } = credentialRepository(ctx.session.id);

  try {
    const credential = await find();

    if (!credential) {
      return { success: false };
    }

    const { data } = await tokenRevoke({ accessToken: credential.accessToken });

    if (!data.revoked) {
      return { success: false };
    }

    await ctx.session.destroy();
    return { success: true };
  } catch {
    return { success: false };
  }
});
