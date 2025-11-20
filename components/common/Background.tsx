import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Background({onLoadEnd}: {onLoadEnd?: () => void}) {
    return (
        <View
            style={styles.background}
        >
            <Image
                source={require("../../assets/images/florian-van-duyn-BR1WANLLpDU-unsplash.jpg")}
                alt="Background Image"
                blurRadius={50}
                style={{ flex: 1, width: "100%", height: "100%", position: "absolute" }}
                onLoadEnd={() => {onLoadEnd && onLoadEnd()}}
            />
            <LinearGradient
                colors={['rgba(33,33,33,1)', 'rgba(40,40,40,0)']}
                style={{ flex: 1, position: "absolute", width: "100%", height: "50%" }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        position: "absolute",
    },
});
