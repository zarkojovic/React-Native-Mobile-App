import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@utils/colors";
import { FC, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
} from "react-native";

interface Props extends TextInputProps {
  isPassword?: boolean;
}

const FormInput: FC<Props> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const { secureTextEntry, isPassword } = props;

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, isPassword && styles.passwordInput]}
        placeholderTextColor={colors.muted}
        secureTextEntry={props.isPassword ? !showPassword : secureTextEntry}
        {...props}
      />
      {isPassword && (
        <Pressable onPress={togglePassword} style={styles.icon}>
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color={colors.muted}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 15,
    width: "100%",
  },
  input: {
    padding: 8,
    borderRadius: 7,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.muted,
    flex: 1,
    fontSize: 14,
  },
  icon: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 7,
    padding: 8,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    marginLeft: -2,
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordInput: {
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export default FormInput;
