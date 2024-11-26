import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgetPassword from "@views/ForgetPassword";
import Home from "@views/Home";
import Profile from "@views/Profile";
import SignIn from "@views/SignIn";
import SignUp from "@views/SignUp";
import { FC } from "react";
import { View, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

interface Props {}

const Stack = createNativeStackNavigator();

const ProfileNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ProfileNavigator;
