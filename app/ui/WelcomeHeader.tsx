import colors from "@utils/colors";

;
import { FC } from "react";
import {StyleSheet, View, Image, Text} from "react-native";
interface Props {}

const heading = "Online Marketplace for Used Goods";

const subheading = "Buy and sell used goods in your area. Easy, fast and free.";

const WelcomeHeader: FC<Props> = (props) => {
    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/hero.png")}
                style={styles.image}
                resizeMode="contain"
                resizeMethod={"resize"}
            />
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.subHeading}>{subheading}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    image:{
        width: 250,
        height: 250
    },
    heading:{
        fontWeight: "600",
        fontSize: 24,
        textAlign: "center",
        letterSpacing: 1,
        marginBottom: 5,
        color: colors.primary
    },
    subHeading:{
        fontSize: 14,
        textAlign: "center",
        lineHeight: 14,
        color: colors.primary
    }
});

export default WelcomeHeader;