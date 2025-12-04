import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Prayer({ info, onLongPress }: { info?: any; onLongPress?: () => void }) {
    return (
        <View style={{ width: "100%" }}>
            <Pressable style={{ width: "100%", gap: 10 }} onLongPress={onLongPress}>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Text style={styles.text}>
                        Lord, I{' '}
                        <Text style={styles.textHighlight}>{info?.type}</Text>
                        {info?.type === "thank" || info?.type === "praise" ? " you" : ""}
                        {' '}on behalf of{' '}
                        <Text style={styles.textHighlight}>{info?.recipient}</Text>
                        :{' '}
                        {info?.body}
                    </Text>
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
        textDecorationLine: "underline",
    },
    text: {
        color: "#ffffff",
        fontSize: 30,
        fontWeight: "600",
    },
});
