import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Background from "./components/common/background";
import OnboardScreen from "./screens/onboarding/Onboarding";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

export default function App() {
    const [fontsLoaded] = useFonts({
        Archivo: require("./assets/fonts/Archivo/Archivo-Regular.ttf"),
        Archivo_100: require("./assets/fonts/Archivo/Archivo-Thin.ttf"),
        Archivo_300: require("./assets/fonts/Archivo/Archivo-Light.ttf"),
        Archivo_700: require("./assets/fonts/Archivo/Archivo-Bold.ttf"),
        Archivo_900: require("./assets/fonts/Archivo/Archivo-Black.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <StatusBar style="light" />
                <Background />
                <OnboardScreen />
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
});
