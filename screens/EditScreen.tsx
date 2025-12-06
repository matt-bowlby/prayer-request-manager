import {
    Animated,
    View,
    Text,
    Pressable,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { StyleSheet } from "react-native";
import Button from "../components/common/Button";
import { Keyboard } from "react-native";
import Dropdown from "../components/common/Dropdown";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import X from "../components/common/icons/X";
import Trash from "../components/common/icons/Trash";
import useEditPrayer from "../hooks/database_hooks/useEditPrayer";
import useDeletePrayer from "../hooks/database_hooks/useDeletePrayer";

export default function EditScreen({ navigation, route }: { navigation: any; route: any }) {
    const editPrayer = useEditPrayer();
    const deletePrayer = useDeletePrayer();
    const prayer = route.params?.info;

    const [type, setType] = useState<PrayerType>(prayer?.type || "pray");
    const [recipient, setRecipient] = useState(prayer?.recipient || "");
    const [body, setBody] = useState(prayer?.body || "");

    const inputRef = React.useRef<TextInput>(null);

    // animated opacity for fading out parts of the form when dropdown opens
    const fadeAnim = React.useRef(new Animated.Value(1)).current;

    const fadeTo = (toValue: number) => {
        Animated.timing(fadeAnim, {
            toValue,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handleSave = () => {
        if (recipient.length === 0 || body.length === 0) return;
        editPrayer.mutate({ id: prayer.id, updatedFields: { type, recipient, body } });
        navigation.goBack();
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleDelete = () => {
        Alert.alert("Delete Prayer", "Are you sure you want to delete this prayer?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    if (prayer?.id !== undefined) {
                        deletePrayer.mutate(prayer.id);
                        navigation.goBack();
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView
            style={{ width: "100%", height: "100%", paddingHorizontal: 20, paddingTop: 10 }}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Pressable style={{ flex: 1, alignItems: "center" }} onPress={Keyboard.dismiss}>
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <Text style={styles.title}>Edit Prayer</Text>
                    </View>
                    <View
                        style={{
                            marginTop: 150,
                            flex: 1,
                            width: "100%",
                            gap: 20,
                            justifyContent: "center",
                        }}
                    >
                        <View style={{ gap: 20 }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.text}>Lord, I </Text>
                                <Dropdown
                                    options={[
                                        "pray",
                                        "ask",
                                        "praise",
                                        "thank",
                                        "confess",
                                        "lament",
                                    ]}
                                    onSelect={(option) => {
                                        setType(option as PrayerType);
                                    }}
                                    onOpen={() => {
                                        Keyboard.dismiss();
                                        fadeTo(0.0);
                                    }}
                                    onClose={() => {
                                        fadeTo(1);
                                    }}
                                    defaultOption={type}
                                />
                                {(type === "thank" || type === "praise") && (
                                    <Text style={styles.text}> you</Text>
                                )}
                            </View>
                            <Animated.View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    opacity: fadeAnim,
                                }}
                            >
                                <Text style={styles.text}>On behalf of </Text>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TextInput
                                        value={recipient}
                                        onChangeText={setRecipient}
                                        style={[styles.text, { textDecorationLine: "underline" }]}
                                        placeholder="Name"
                                        placeholderTextColor="#ffffff88"
                                    />
                                    <Text style={styles.text}>:</Text>
                                </View>
                            </Animated.View>
                        </View>
                        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                            <ScrollView
                                style={{ overflow: "scroll", height: "100%" }}
                                contentContainerStyle={{ flexGrow: 1 }}
                            >
                                <TextInput
                                    value={body}
                                    ref={inputRef}
                                    onChangeText={setBody}
                                    style={[
                                        styles.text,
                                        {
                                            borderBottomWidth: 0,
                                            flex: 1,
                                        },
                                    ]}
                                    scrollEnabled={false}
                                    placeholder="Enter prayer..."
                                    placeholderTextColor="#ffffff88"
                                    multiline
                                    submitBehavior="blurAndSubmit"
                                />
                            </ScrollView>
                        </Animated.View>
                    </View>
                </Pressable>
            </KeyboardAvoidingView>
            <View style={{ width: "100%", alignItems: "center" }}>
                <View
                    style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}
                >
                    <Pressable
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={() => handleCancel()}
                    >
                        <X width={40} height={40} color="#ffffff88" />
                    </Pressable>
                    <Pressable
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={() => handleDelete()}
                    >
                        <Trash width={40} height={40} color="#ffffff88" />
                    </Pressable>
                </View>
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
                        handleSave();
                        Keyboard.dismiss();
                    }}
                >
                    <Text style={{ fontFamily: "Archivo", fontWeight: "900", fontSize: 25 }}>
                        Update
                    </Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Archivo",
        fontSize: 40,
        color: "#ffffff",
    },
    text: {
        fontFamily: "Archivo",
        fontWeight: "600",
        fontSize: 30,
        color: "#ffffff",
    },
    textHighlight: {
        fontFamily: "Archivo",
        fontWeight: "600",
        fontSize: 30,
        color: "#ffffff",
    },
    cancelText: {
        fontFamily: "Archivo",
        fontSize: 18,
        color: "#ffffff88",
    },
});
