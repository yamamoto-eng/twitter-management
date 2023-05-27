import { useEffectOnce, useLocalStorage } from "react-use";
import { atom, useRecoilState } from "recoil";

type UserInfo =
  | {
      isLogin: true;
      name: string;
      userName: string;
      image: string;
    }
  | {
      isLogin: false;
    };

const initialUserInfo: UserInfo = {
  isLogin: false,
};

const userInfoAtom = atom<UserInfo>({
  key: "userInfo",
  default: {
    isLogin: false,
  },
});

export const useUserInfoWithStorage = () => {
  const [userInfoStorage, setUserInfoStorage] = useLocalStorage<UserInfo>("user-info", initialUserInfo);
  const [userInfoState, setUserInfoState] = useRecoilState(userInfoAtom);

  useEffectOnce(() => {
    setUserInfoState(userInfoStorage ?? initialUserInfo);
  });

  const setUserInfo = (userInfo: UserInfo) => {
    setUserInfoStorage(userInfo);
    setUserInfoState(userInfo);
  };

  return {
    userInfo: userInfoState,
    setUserInfo,
  };
};
