import { useLocalStorage } from "react-use";
import { useClient } from "./useClient";

type TwitterProfile =
  | {
      isLogin: true;
      name: string;
      userName: string;
      image: string;
    }
  | {
      isLogin: false;
    };

const initialValue: TwitterProfile = {
  isLogin: false,
};

export const useTwitterProfile = () => {
  const { isClient } = useClient();
  const [twitterProfile, setTwitterProfile] = useLocalStorage<TwitterProfile>("twitter-profile", initialValue);

  return {
    twitterProfile: isClient ? twitterProfile : initialValue,
    setTwitterProfile: setTwitterProfile,
  };
};
