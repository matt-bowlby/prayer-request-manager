import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Button from "../components/common/Button";
import TextBox from "../components/common/TextBox";
import { usePrayerStore } from "../stores/PrayerStore";
import { useState } from "react";
import { Keyboard } from "react-native";
import CreateTab from "../components/screen/home/create/CreateTab";

export default function FirstCreateScreen({ navigation }: any) {
    const addPrayer = usePrayerStore((state) => state.addPrayer);
    const [recipient, setRecipient] = useState("");
    const [body, setBody] = useState("");

    return (
        <SafeAreaView
            style={{ width: "100%", height: "100%", paddingHorizontal: 20, paddingTop: 10 }}
        >
            <Pressable
                style={{ flex: 1 }}
                onPress={Keyboard.dismiss}
            >
                <CreateTab title="First Prayer" onSubmit={() => navigation.navigate("Home")} />
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Archivo",
        fontSize: 30,
        color: "#ffffff",
    },
    textBoxContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        color: "#ffffff",
        fontFamily: "Archivo",
        fontSize: 16,
    },
    label: {
        fontFamily: "Archivo",
        fontSize: 20,
        color: "#ffffff",
    },
});
