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
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAppData } from "./storage/database";

import { initDB } from "./storage/database";

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function App() {
    const [fontsLoaded] = useFonts({
        Archivo: require("./assets/fonts/Archivo/Archivo-Regular.ttf"),
        Archivo_100: require("./assets/fonts/Archivo/Archivo-Thin.ttf"),
        Archivo_300: require("./assets/fonts/Archivo/Archivo-Light.ttf"),
        Archivo_700: require("./assets/fonts/Archivo/Archivo-Bold.ttf"),
        Archivo_900: require("./assets/fonts/Archivo/Archivo-Black.ttf"),
    });
    const [appReady, setAppReady] = React.useState(false);
    const [bgLoaded, setBgLoaded] = React.useState(false);
    const [onboardingComplete, setOnboardingComplete] = React.useState(false);

    React.useEffect(() => {
        let mounted = true;
        async function fetchData() {
            try {
                await initDB();
                const appData = await getAppData();
                setOnboardingComplete(appData.onboardingComplete);
            } catch (err) {
                console.error("startup failure:", err);
            } finally {
                if (mounted) {
                    setAppReady(true);
                }
            }
        }
        fetchData();
        return () => {
            mounted = false;
        };
    }, []);

    React.useEffect(() => {
        async function hideSplash() {
            if (bgLoaded && appReady) {
                await SplashScreen.hideAsync();
            }
        }
        hideSplash();
    }, [bgLoaded, appReady]);

    if (!fontsLoaded || !appReady) return null;

    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <View style={styles.container}>
                    <StatusBar style="light" />
                    <Background
                        onLoadEnd={() => {
                            setBgLoaded(true);
                        }}
                    />
                    <NavigationContainer>
                        <Stack.Navigator
                            initialRouteName={onboardingComplete ? "Home" : "Onboard"}
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
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
});
