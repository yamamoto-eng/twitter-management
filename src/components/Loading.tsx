import { CircularProgress } from "@mui/material";
import { Overlay } from "./Overlay";

export const Loading = () => {
  return (
    <Overlay>
      <CircularProgress />
    </Overlay>
  );
};
