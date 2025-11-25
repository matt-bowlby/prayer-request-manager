import {
    View,
    Text,
    Pressable,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { StyleSheet } from "react-native";
import Button from "../../../common/Button";
import { usePrayerStore } from "../../../../stores/PrayerStore";
import { Keyboard } from "react-native";
import Dropdown from "../../../common/Dropdown";
import { usePrayerCreateStore } from "./PrayerCreateStore";
import React from "react";

export default function CreateTab({
    title = "New Prayer",
    onSubmit,
}: {
    title?: string;
    onSubmit?: () => void;
}) {
    const addPrayer = usePrayerStore((state) => state.addPrayer);

    const inputRef = React.useRef<TextInput>(null);

    const setType = usePrayerCreateStore((state) => state.setType);
    const setRecipient = usePrayerCreateStore((state) => state.setRecipient);
    const setBody = usePrayerCreateStore((state) => state.setBody);
    const type = usePrayerCreateStore((state) => state.type);
    const recipient = usePrayerCreateStore((state) => state.recipient);
    const body = usePrayerCreateStore((state) => state.body);
    const reset = usePrayerCreateStore((state) => state.reset);

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Pressable
                style={{ flex: 1, alignItems: "center" }}
                onPress={Keyboard.dismiss}
            >
                <View style={{ width: "100%", alignItems: "flex-start" }}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={{ flex: 1, width: "100%", gap: 20, justifyContent: "center", borderWidth: 1, marginBottom: 100 }}>
                    <View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.label}>Lord, I </Text>
                            <Dropdown
                                options={["pray", "ask", "praise", "thank", "confess", "lament"]}
                                onSelect={(option) => {
                                    setType(option as PrayerType);
                                }}
                                onOpen={() => {
                                    Keyboard.dismiss();
                                }}
                                onClose={() => {}}
                                defaultOption={"pray"}
                                minWidth={100}
                            />
                            {(type === "thank" || type === "praise") && (
                                <Text style={styles.label}>you</Text>
                            )}
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <Text style={styles.label}>On behalf of </Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <TextInput
                                    value={recipient}
                                    onChangeText={setRecipient}
                                    style={styles.input}
                                    placeholder="Name"
                                    placeholderTextColor="#ffffff88"
                                    multiline
                                    submitBehavior="blurAndSubmit"
                                />
                            </View>
                            <Text style={styles.label}>:</Text>
                        </View>
                    </View>
                    <ScrollView style={{ overflow: "scroll", outlineWidth: 1 }}>
                        <TextInput
                            value={body}
                            ref={inputRef}
                            onChangeText={setBody}
                            style={[styles.input, { borderBottomWidth: 0 }]}
                            placeholder="Enter prayer"
                            placeholderTextColor="#ffffff88"
                            multiline
                            submitBehavior="blurAndSubmit"
                        />
                    </ScrollView>
                </View>
                <View style={{ width: "100%", alignItems: "center", position: "absolute", bottom: 0 }}>
                    <Button
                        disabled={recipient.length === 0 || body.length === 0}
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
                            if (recipient.length === 0 || body.length === 0) return;
                            addPrayer({
                                id: 0,
                                type: type,
                                recipient: recipient,
                                body: body,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                seen: false,
                                deleted: false,
                            });
                            onSubmit?.();
                            reset();
                        }}
                    >
                        <Text style={{ fontFamily: "Archivo", fontWeight: "900", fontSize: 25 }}>
                            Create
                        </Text>
                    </Button>
                </View>
            </Pressable>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Archivo",
        fontSize: 40,
        color: "#ffffff",
    },
    label: {
        fontFamily: "Archivo",
        fontWeight: "600",
        fontSize: 30,
        color: "#ffffffaa",
    },
    input: {
        fontFamily: "Archivo",
        fontWeight: "600",
        fontSize: 30,
        color: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff",
    },
});
