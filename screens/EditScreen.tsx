import { View, Text, Pressable, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Button from "../components/common/Button";
import TextBox from "../components/common/TextBox";
import { usePrayerStore } from "../stores/PrayerStore";
import { useState } from "react";
import X from "../components/common/icons/X";

export default function CreateScreen({ route, navigation }: any) {
    const { info } = route.params;
    const EditPrayer = usePrayerStore((state) => state.editPrayer);
    const [title, setTitle] = useState(info.title);
    const [description, setDescription] = useState(info.description);

    return (
        <SafeAreaView
            style={{ width: "100%", height: "100%", paddingHorizontal: 20, paddingTop: 10 }}
        >
            <Pressable
                style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
                onPress={Keyboard.dismiss}
            >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={styles.title}>Edit Prayer</Text>
                    <Pressable onPress={() => navigation.goBack()}>
                        <X width={40} height={40} color={"#ffffff"} />
                    </Pressable>
                </View>
                <View style={{ width: "100%", gap: 20 }}>
                    <TextBox
                        label="Title"
                        value={title}
                        placeholder="Enter title"
                        labelStyle={styles.label}
                        style={[styles.textBoxContainer, { borderRadius: 20 }]}
                        placeholderTextColor={"rgba(255, 255, 255, 0.45)"}
                        maxLength={100}
                        onChangeText={(value: string) => setTitle(value)}
                    />
                    <TextBox
                        label="Description"
                        value={description}
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
                        styleProps={{
                            marginTop: 20,
                            paddingVertical: 30,
                            paddingHorizontal: 20,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={() => {
                            EditPrayer(info.id, {
                                title: title,
                                description: description,
                                tags: [],
                                updatedAt: new Date().toISOString(),
                            });
                            navigation.navigate("Home");
                        }}
                    >
                        <Text style={{ fontFamily: "Archivo", fontWeight: "900", fontSize: 25 }}>
                            Update
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
