import { FC, useState } from "react";
import { View, StyleSheet, Text, Platform, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "@utils/colors";
import { formatDate } from "@utils/date";

interface Props {
  title: string;
  value: Date;
  onChange(date: Date): void;
}

const isIOS = Platform.OS === "ios";

const DatePicker: FC<Props> = ({ title, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const visible = isIOS ? true : showPicker;

  const onPress = () => {
    if (!isIOS) {
      setShowPicker(true);
    }
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {!isIOS ? (
        <Text style={styles.value}>
          {formatDate(value.toISOString(), "dd-LLL-yyyy")}
        </Text>
      ) : null}
      {visible ? (
        <DateTimePicker
          value={value}
          testID="dateTimePicker"
          onChange={(_, selectedDate) => {
            if (selectedDate) {
              onChange(selectedDate);
            }
            if (!isIOS) {
              setShowPicker(false);
            }
          }}
        />
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: !isIOS ? 10 : 0,
    borderWidth: isIOS ? 0 : 1,
    borderColor: colors.muted,
    borderRadius: 5,
  },
  title: {
    marginRight: 10,
    color: colors.primary,
  },
  value: {
    color: colors.primary,
    padding: 10,
  },
});

export default DatePicker;
