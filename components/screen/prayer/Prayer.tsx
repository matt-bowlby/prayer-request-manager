import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Prayer({ info }: { info?: any }) {
    console.log("Rendering Prayer:", info);
    return (
        <View style={{ width: "100%" }}>
            <Text style={styles.title}>{info?.title}</Text>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{info?.content}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        width: "100%",
        borderTopWidth: 1,
        borderTopColor: "#ffffff45",
    },
    title: {
        color: "#ffffff",
        fontSize: 25,
        fontWeight: "900",
        textAlign: "left",
    },
    text: {
        color: "#ffffff",
        fontSize: 22,
        textAlign: "left",
    },
});
