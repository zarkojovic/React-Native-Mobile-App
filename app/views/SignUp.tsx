import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import WelcomeHeader from "@ui/WelcomeHeader";
import colors from "@utils/colors";
import FormInput from "@ui/FormInput";
import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormNavigator from "@ui/FormNavigator";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@navigator/AuthNavigator";
import * as yup from "yup";
import axios from "axios";
import { newUserSchema, yupValidate } from "@utils/validator";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import client from "app/api/client";
import { SignInRes } from "./SignIn";
import useAuth from "app/hooks/useAuth";

interface Props {}

const SignUp: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { email, name, password } = userInfo;

  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const { signIn } = useAuth();

  const handleChange = (name: string) => (value: string) =>
    setUserInfo({ ...userInfo, [name]: value });

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(newUserSchema, userInfo);

    if (error) {
      return showMessage({
        message: error,
        type: "danger",
      });
    }

    setLoading(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/sign-up", values)
    );

    if (res?.message) {
      showMessage({
        message: res.message,
        type: "success",
      });
      signIn(values!);
    }
    setLoading(false);
  };

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Name"
            keyboardType="default"
            value={name}
            onChangeText={handleChange("name")}
          />
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={handleChange("email")}
            value={email}
          />
          <FormInput
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={handleChange("password")}
            value={password}
          />
          <AppButton
            title="Sign Up"
            onPress={handleSubmit}
            isActive={!loading}
          />
          <FormDivider />
          <FormNavigator
            leftTitle="Forgot Password?"
            rightTitle="Sign In"
            onLeftPress={() => navigate("ForgetPassword")}
            onRightPress={() => navigate("SignIn")}
          />
        </View>
      </View>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 100,
  },
  innerContainer: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  container: {
    flex: 1,
  },
  image: {
    width: 250,
    height: 250,
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 5,
    color: colors.primary,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.muted,
  },
  formContainer: {
    marginTop: 20,
  },
});

export default SignUp;
