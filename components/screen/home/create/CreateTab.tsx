import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Button from "../../../common/Button";
import TextBox from "../../../common/TextBox";
import { usePrayerStore } from "../../../../stores/PrayerStore";
import { useState } from "react";
import { Keyboard } from "react-native";

export default function CreateTab({ onSubmit }: { onSubmit?: () => void }) {
    const addPrayer = usePrayerStore((state) => state.addPrayer);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <Pressable
            style={{ flex: 1, justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}
            onPress={Keyboard.dismiss}
        >
            <View style={{ width: "100%", alignItems: "flex-start" }}>
                <Text style={styles.title}>New Prayer</Text>
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
						if (title.length === 0 || description.length === 0) return;
                        addPrayer({
                            id: 0,
                            title: title,
                            description: description,
                            tags: [],
                            createdAt: (new Date()).toISOString(),
                            updatedAt: (new Date()).toISOString(),
                            seen: false,
                            deleted: false,
                        });
						if (onSubmit) {
							onSubmit();
						}
                    }}
                >
                    <Text style={{ fontFamily: "Archivo", fontWeight: "900", fontSize: 25 }}>
                        Create
                    </Text>
                </Button>
            </View>
        </Pressable>
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
