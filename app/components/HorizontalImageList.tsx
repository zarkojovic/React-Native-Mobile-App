import { FC } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

interface Props {
  images: string[];
  onPress?(item: string): void;
  onLongPress?(item: string): void;
  style?: StyleProp<ViewStyle>;
}

const HorizontalImageList: FC<Props> = ({
  images,
  onPress,
  onLongPress,
  style,
}) => {
  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item}
      horizontal
      contentContainerStyle={[styles.container, style]}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable
          style={styles.listItem}
          onPress={() => onPress && onPress(item)}
          onLongPress={() => onLongPress && onLongPress(item)}
        >
          <Image source={{ uri: item }} style={styles.image} />
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    flex: 1,
  },
  listItem: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5,
    overflow: "hidden",
  },
});

export default HorizontalImageList;
