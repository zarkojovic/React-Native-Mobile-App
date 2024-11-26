import colors from "@utils/colors";
import { FC } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

interface Props {
  title: string;
  isActive?: boolean;
  onPress?: () => void;
}

const AppButton: FC<Props> = ({ title, isActive = true, onPress }) => {
  return (
    <Pressable
      style={[styles.button, isActive ? styles.btnActive : styles.btnInactive]}
      onPress={isActive ? onPress : null}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btnActive: {
    backgroundColor: colors.primary,
  },
  btnInactive: {
    backgroundColor: colors.muted,
  },
  title: {
    color: colors.white,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

export default AppButton;
