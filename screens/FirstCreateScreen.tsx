import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Button from "../components/common/Button";
import TextBox from "../components/common/TextBox";
import { usePrayerStore } from "../stores/PrayerStore";
import { useState } from "react";
import { Keyboard } from "react-native";

export default function FirstCreateScreen({ navigation }: any) {
    const addPrayer = usePrayerStore((state) => state.addPrayer);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <SafeAreaView
            style={{ width: "100%", height: "100%", paddingHorizontal: 20, paddingTop: 10 }}
        >
            <Pressable
                style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
                onPress={Keyboard.dismiss}
            >
                <View style={{ width: "100%", alignItems: "flex-start" }}>
                    <Text style={styles.title}>Your First Prayer</Text>
                </View>
                <View style={{ width: "100%", gap: 20 }}>
                    <TextBox
                        label="Title"
                        placeholder="Enter title"
                        labelStyle={styles.label}
                        style={[styles.textBoxContainer, { borderRadius: 20 }]}
                        placeholderTextColor={"rgba(255, 255, 255, 0.45)"}
                        maxLength={100}
                        onChangeText={(value: string) => setTitle(value)}
                    />
                    <TextBox
                        label="Description"
                        placeholder="Enter description"
                        multiline
                        numberOfLines={6}
                        labelStyle={styles.label}
                        style={[styles.textBoxContainer, { borderRadius: 20, height: 120 }]}
                        maxLength={500}
                        placeholderTextColor={"rgba(255, 255, 255, 0.45)"}
                        onChangeText={(value: string) => setDescription(value)}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={{ width: "100%", alignItems: "center" }}>
                    <Button
                        disabled={title.length === 0 || description.length === 0}
                        disabledStyleProps={{ opacity: 0.5 }}
                        styleProps={{
                            marginTop: 20,
                            paddingVertical: 30,
                            paddingHorizontal: 20,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={() => {
                            addPrayer({
                                id: Math.random().toString(36).toString(),
                                title: title,
                                description: description,
                                tags: [],
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            });
                            navigation.navigate("Prayer");
                        }}
                    >
                        <Text style={{ fontFamily: "Archivo", fontWeight: "900", fontSize: 25 }}>
                            Create
                        </Text>
                    </Button>
                </View>
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
