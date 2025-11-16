import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function OnboardScreen() {
    return (
        <SafeAreaView style={{ width: "100%", height: "100%" }}>
            <View style={{ flex: 1 }}>
                <View>
                    <Text style={styles.title}>Welcome to your personal</Text>
                    <Text style={styles.titleBold}>Prayer Request Manager</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Archivo",
        fontSize: 40,
        color: "#ffffff80",
    },
    titleBold: {
        fontFamily: "Archivo",
        fontSize: 40,
        color: "#fff",
        fontWeight: "900",
    },
});
