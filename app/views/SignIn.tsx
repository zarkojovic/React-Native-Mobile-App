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
import { signInSchema, yupValidate } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";
import useAuth from "app/hooks/useAuth";

interface Props {}

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

const SignIn: FC<Props> = (props) => {
  const { signIn } = useAuth();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userInfo;
  const dispatch = useDispatch();
  const handleChange = (name: string) => (value: string) =>
    setUserInfo({ ...userInfo, [name]: value });

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(signInSchema, userInfo);

    if (error && error.length > 0) {
      return showMessage({
        message: error,
        type: "danger",
      });
    }
    if (values) signIn(values);
  };

  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleChange("email")}
          />
          <FormInput
            placeholder="Password"
            isPassword={true}
            autoCapitalize="none"
            value={password}
            onChangeText={handleChange("password")}
          />
          <AppButton title="Sign In" onPress={handleSubmit} />
          <FormDivider />
          <FormNavigator
            leftTitle="Forgot Password?"
            rightTitle="Sign Up"
            onLeftPress={() => navigate("ForgetPassword")}
            onRightPress={() => navigate("SignUp")}
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
    padding: 15,
    flex: 1,
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

export default SignIn;
