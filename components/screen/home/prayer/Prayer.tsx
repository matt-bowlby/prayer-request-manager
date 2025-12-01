import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Prayer({ navigation, info }: { navigation: any; info?: any }) {
    return (
        <View style={{ width: "100%" }}>
            <Pressable style={{ width: "100%", gap: 10 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Text style={styles.text}>Lord, I </Text>
                    <Text style={styles.textHighlight}>{info?.type}</Text>
                    <Text style={styles.text}> on behalf of </Text>
                    <Text style={styles.textHighlight}>{info?.recipient}</Text>
                    <Text style={styles.text}>: </Text>
                    <Text style={styles.textHighlight}>{info?.body}</Text>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        width: "100%",
        borderTopWidth: 1,
        borderTopColor: "#ffffff45",
        paddingTop: 10,
    },
    textHighlight: {
        color: "#ffffff",
        fontSize: 30,
        fontWeight: "600",
    },
    text: {
        color: "#ffffffaa",
        fontSize: 30,
        fontWeight: "600",
    },
});
