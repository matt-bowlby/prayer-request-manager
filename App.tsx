import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Background from "./components/common/background";
import OnboardScreen from "./screens/Onboarding/Onboarding";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";

const Stack = createNativeStackNavigator();

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
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Onboarding"
                        screenOptions={{
                            headerShown: false, // removes the top bar
                            contentStyle: { backgroundColor: "#00000000" }, // sets the screen background
                        }}
                    >
                        <Stack.Screen name="Onboarding" component={OnboardScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
});
