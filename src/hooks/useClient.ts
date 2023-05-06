import { useState } from "react";
import { useEffectOnce } from "react-use";

export const useClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffectOnce(() => {
    setIsClient(true);
  });

  return { isClient };
};
