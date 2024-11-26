import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import colors from "@utils/colors";
import React, { FC, useEffect } from "react";
import { StyleSheet } from "react-native";
import AuthNavigator from "@navigator/AuthNavigator";
import { useDispatch, useSelector } from "react-redux";
import { Profile, updateAuthState } from "app/store/auth";
import client from "app/api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import LoadingAnimation from "@ui/LoadingAnimation";
import useAuth from "app/hooks/useAuth";
import TabNavigator from "./TabNavigator";
import useClient from "app/hooks/useClient";
import asyncStorage, { Keys } from "@utils/asyncStorage";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

interface Props {}

const Navigator: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { isLoggedIn, authState } = useAuth();
  const { authClient } = useClient();
  const fetchAuthState = async () => {
    const token = await asyncStorage.get(Keys.AUTH_TOKEN);
    if (token) {
      dispatch(updateAuthState({ pending: true, profile: null }));
      const res = await runAxiosAsync<{ profile: Profile }>(
        authClient.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      if (res) {
        dispatch(updateAuthState({ pending: false, profile: res.profile }));
      } else {
        dispatch(updateAuthState({ pending: false, profile: null }));
      }
    }
  };

  useEffect(() => {
    fetchAuthState();
  }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      <LoadingAnimation visible={authState.pending} />
      {!isLoggedIn ? <AuthNavigator /> : <TabNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Navigator;
