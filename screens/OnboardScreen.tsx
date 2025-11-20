import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Button from "../components/common/Button";

export default function OnboardScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.frame}>
                <View>
                    <Text style={styles.title}>Welcome to your personal</Text>
                    <Text style={styles.titleBold}>Prayer Request Manager</Text>
                </View>
                <Button
                    styleProps={styles.button}
                    onPress={() => navigation.navigate("FirstCreate")}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </Button>
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
    safeArea: {
        width: "100%",
        height: "100%",
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    frame: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    button: {
        marginTop: 20,
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "Archivo",
        fontWeight: "900",
        fontSize: 25,
    },
});
