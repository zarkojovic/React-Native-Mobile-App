import { FC, useState } from "react";
import {
  StyleSheet,
  Platform,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import WelcomeHeader from "@ui/WelcomeHeader";
import colors from "@utils/colors";
import FormInput from "@ui/FormInput";
import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormNavigator from "@ui/FormNavigator";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@navigator/AuthNavigator";
import { emailRegex } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";

interface Props {}

const ForgetPassword: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      return showMessage({
        message: "Invalid email address",
        type: "danger",
      });
    }
    setLoading(true);

    // send the email
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/forget-password", { email })
    );
    setLoading(false);

    if (res?.message) {
      showMessage({
        message: res.message,
        type: "success",
      });
    }
  };

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
            onChangeText={(text) => setEmail(text)}
          />
          <AppButton
            title={loading ? "Loading..." : "Submit"}
            onPress={handleSubmit}
            isActive={!loading}
          />
          <FormDivider />
          <FormNavigator
            leftTitle="Sign Up"
            rightTitle="Sign In"
            onLeftPress={() => navigate("SignUp")}
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

export default ForgetPassword;
