import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import AppNavigator from "./AppNavigator";
import ProfileNavigator from "./ProfileNavigator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NewListing from "@views/NewListing";

const Tab = createBottomTabNavigator();

const getOptions = (
  iconName: string,
  title: string
): BottomTabNavigationOptions => {
  return {
    tabBarIcon({ color, focused, size }) {
      return (
        <MaterialCommunityIcons
          name={iconName as any}
          size={size}
          color={color}
        />
      );
    },
    title: title,
  };
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeNavigator"
        component={AppNavigator}
        options={getOptions("home", "Home")}
      />
      <Tab.Screen
        name="NewListing"
        component={NewListing}
        options={getOptions("plus-circle", "Create")}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={getOptions("account", "Profile")}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
