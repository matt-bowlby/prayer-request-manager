import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Button from "../../components/screen/Button";

export default function OnboardScreen() {
    return (
        <SafeAreaView style={{ width: "100%", height: "100%" }}>
            <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", marginHorizontal: 20, }}>
                <View>
                    <Text style={styles.title}>Welcome to your personal</Text>
                    <Text style={styles.titleBold}>Prayer Request Manager</Text>
                </View>
                <Button
                    text="Get Started"
                    styleProps={{ marginTop: 20, paddingVertical: 30, paddingHorizontal: 20, width: "100%" }}
                    textStyleProps={{fontFamily: "Archivo", fontWeight: "900", fontSize: 25}}
                />
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
