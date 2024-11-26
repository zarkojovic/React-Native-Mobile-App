import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { getAuthState, updateAuthState } from "app/store/auth";
import { useDispatch, useSelector } from "react-redux";

type UserInfo = {
  email: string;
  password: string;
};

export interface SignInRes {
  profile: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector(getAuthState);
  const signIn = async (userInfo: UserInfo) => {
    dispatch(updateAuthState({ profile: null, pending: true }));
    const res = await runAxiosAsync<SignInRes>(
      client.post("/auth/sign-in", userInfo)
    );

    if (res) {
      // store the tokens
      await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
      await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
      // await AsyncStorage.setItem("access-token", res.tokens.access);
      // await AsyncStorage.setItem("refresh-token", res.tokens.refresh);
      dispatch(
        updateAuthState({
          profile: { ...res.profile, accessToken: res.tokens.access },
          pending: false,
        })
      );
    } else {
      dispatch(updateAuthState({ profile: null, pending: false }));
    }
  };

  const isLoggedIn: boolean = authState.profile ? true : false;
  return {
    signIn,
    isLoggedIn,
    authState,
  };
};

export default useAuth;
