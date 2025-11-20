import { useFonts } from "expo-font";
import React from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import Background from "./components/common/Background";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import OnboardScreen from "./screens/OnboardScreen";
import EditScreen from "./screens/EditScreen";
import FirstCreateScreen from "./screens/FirstCreateScreen";
import HomeScreen from "./screens/HomeScreen";

import { initDB } from "./storage/database";

import { usePrayerStore } from "./stores/PrayerStore";

const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        Archivo: require("./assets/fonts/Archivo/Archivo-Regular.ttf"),
        Archivo_100: require("./assets/fonts/Archivo/Archivo-Thin.ttf"),
        Archivo_300: require("./assets/fonts/Archivo/Archivo-Light.ttf"),
        Archivo_700: require("./assets/fonts/Archivo/Archivo-Bold.ttf"),
        Archivo_900: require("./assets/fonts/Archivo/Archivo-Black.ttf"),
    });
    const [appReady, setAppReady] = React.useState(false);

    React.useEffect(() => {
        let mounted = true;
        async function fetchData() {
            try {
                await initDB();
                await usePrayerStore.getState().getPrayers();
            } catch (err) {
                console.error("startup failure:", err);
            } finally {
                if (mounted) setAppReady(true);
            }
        }
        fetchData();
        return () => {
            mounted = false;
        };
    }, []);

    if (!fontsLoaded || !appReady) return null;

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <StatusBar style="light" />
                <Background />
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName={usePrayerStore.getState().prayers.length <= 0 ? "Onboard" : "Home"}
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: "#00000000" },
                        }}
                    >
                        <Stack.Screen name="Onboard" component={OnboardScreen} />
                        <Stack.Screen name="FirstCreate" component={FirstCreateScreen} />
                        <Stack.Screen name="Home" component={HomeScreen} />
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
