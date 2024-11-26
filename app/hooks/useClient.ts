import axios from "axios";
import useAuth from "./useAuth";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { useDispatch } from "react-redux";
import { updateAuthState } from "app/store/auth";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const authClient = axios.create({ baseURL });

type Response = { tokens: { access: string; refresh: string } };

const useClient = () => {
  const { authState } = useAuth();
  const dispatch = useDispatch();

  const token = authState.profile?.accessToken;

  authClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshAuthLogic = async (failedRequest: any) => {
    const refreshToken = await asyncStorage.get(Keys.REFRESH_TOKEN);

    const options = {
      method: "POST",
      url: "/auth/refresh",
      data: { refreshToken },
    };

    const res = await runAxiosAsync<Response>(axios(options));

    if (res?.tokens) {
      failedRequest.response.config.headers.Authorization = `Bearer ${res.tokens.access}`;
      await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
      await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
      dispatch(
        updateAuthState({
          profile: { ...authState.profile!, accessToken: res.tokens.access },
          pending: false,
        })
      );
      return Promise.resolve();
    }
  };

  createAuthRefreshInterceptor(authClient, refreshAuthLogic);

  return {
    authClient,
  };
};

export default useClient;
