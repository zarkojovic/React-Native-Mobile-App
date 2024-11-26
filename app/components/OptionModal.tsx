import colors from "@utils/colors";
import { FC } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Text,
  Pressable,
} from "react-native";

interface Props<T> {
  visible: boolean;
  onRequestClose(state: boolean): void;
  options: T[];
  RenderItem(item: T): JSX.Element;
  onPress(item: T): void;
}

const OptionModal = <T extends unknown>({
  visible,
  options,
  onRequestClose,
  RenderItem,
  onPress,
}: Props<T>) => {
  const handleClose = () => onRequestClose(!visible);
  return (
    <Modal
      transparent
      style={styles.container}
      visible={visible}
      onRequestClose={handleClose}
    >
      <Pressable
        style={styles.container}
        onPress={() => onRequestClose(!visible)}
      >
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <ScrollView>
              {options.map((item, index) => {
                return (
                  <Pressable key={index} onPress={() => onPress(item)}>
                    {RenderItem(item)}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: colors.backDrop,
  },
  innerContainer: {
    width: "90%",
    backgroundColor: colors.muted,
    padding: 10,
    borderRadius: 7,
    maxHeight: 200,
  },
});

export default OptionModal;
