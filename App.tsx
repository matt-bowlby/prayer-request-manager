import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Background from "./components/common/Background";
import OnboardScreen from "./screens/OnboardScreen";
import PrayerScreen from "./screens/PrayerScreen";
import CreateScreen from "./screens/CreateScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { usePrayerStore } from "./stores/PrayerStore";
import EditScreen from "./screens/EditScreen";
import FirstCreateScreen from "./screens/FirstCreateScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        Archivo: require("./assets/fonts/Archivo/Archivo-Regular.ttf"),
        Archivo_100: require("./assets/fonts/Archivo/Archivo-Thin.ttf"),
        Archivo_300: require("./assets/fonts/Archivo/Archivo-Light.ttf"),
        Archivo_700: require("./assets/fonts/Archivo/Archivo-Bold.ttf"),
        Archivo_900: require("./assets/fonts/Archivo/Archivo-Black.ttf"),
    });

    // Always call hooks at the top level
    const addPrayer = usePrayerStore((state) => state.addPrayer);

    useEffect(() => {
        if (!fontsLoaded) return;
        addPrayer({
            id: "1",
            title: "Sample Prayer 1",
            description: "This is the content of sample prayer 1.",
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        addPrayer({
            id: "2",
            title: "Sample Prayer 2",
            description: "This is the content of sample prayer 2.",
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        addPrayer({
            id: "3",
            title: "Sample Prayer 3",
            description: "This is the content of sample prayer 3.",
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }, [addPrayer, fontsLoaded]);

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
                        initialRouteName="Onboard"
                        screenOptions={{
                            headerShown: false, // removes the top bar
                            contentStyle: { backgroundColor: "#00000000" }, // sets the screen background
                        }}
                    >
                        <Stack.Screen name="Onboard" component={OnboardScreen} />
                        <Stack.Screen name="FirstCreate" component={FirstCreateScreen} />
                        <Stack.Screen name="Prayer" component={PrayerScreen} />
                        <Stack.Screen name="Create" component={CreateScreen} />
                        <Stack.Screen name="Edit" component={EditScreen} />
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
