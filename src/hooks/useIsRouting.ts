import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useIsRouting = () => {
  const router = useRouter();

  const [isRouting, setIsRouting] = useState(false);

  const handleStart = () => {
    setIsRouting(true);
  };

  const handleComplete = () => {
    setIsRouting(false);
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return { isRouting };
};
