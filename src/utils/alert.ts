import { enqueueSnackbar } from "notistack";

type Args = Parameters<typeof enqueueSnackbar>;

export const aleat = (...args: Args) => {
  const [message, options] = args;
  enqueueSnackbar(message, {
    variant: "success",
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
    ...options,
  });
};
