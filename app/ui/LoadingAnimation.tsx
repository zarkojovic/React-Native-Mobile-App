import colors from "@utils/colors";
import LottieView from "lottie-react-native";
import { FC } from "react";
import { View, StyleSheet, Modal } from "react-native";

interface Props {
  visible: boolean;
}

const LoadingAnimation: FC<Props> = ({ visible }) => {
  if (!visible) return null;
  return (
    <Modal animationType="fade" transparent={true}>
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/loading.json")}
          autoPlay
          loop
          style={{ flex: 1, transform: [{ scale: 0.5 }] }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backDrop,
  },
});

export default LoadingAnimation;
