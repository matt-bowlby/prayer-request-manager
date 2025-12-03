import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import Button from '../../../common/Button';

export default function SettingsTab() {
    const [claudeEnabled, setClaudeEnabled] = useState(false);

    // Edit these titles in code if you want to change what's displayed.
    const titles: string[] = [
        "Account Information",
        "Privacy",
        "Notifications",
        "Language",
        "Reminders",
        "Profile",
        "Help & Support",
        "Clear all data",
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                {titles.map((item, idx) => (
                    <Button
                        key={`${item}-${idx}`}
                        styleProps={styles.itemButton}
                        onPress={() => Alert.alert(`${item}`)}
                    >
                        <Text style={styles.itemText}>{item}</Text>
                    </Button>
                ))}
            </ScrollView>

            {/* Titles are edited in code only; no runtime editing UI. */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "flex-start", alignItems: "center" },
    header: { width: "100%", alignItems: "center", paddingTop: 12, paddingBottom: 30 },
    title: { fontFamily: "Archivo", fontSize: 40, color: "#ffffff" },
    list: { width: "100%", paddingHorizontal: 16 },
    listContent: { alignItems: "stretch", paddingBottom: 24 },
    itemButton: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginVertical: 4,
        borderRadius: 15,
        backgroundColor: "#e6e1e1",
        alignItems: "flex-start",
    },
    itemText: { fontSize: 18, color: "#333333", fontFamily: "Archivo" },
    enabledButton: { backgroundColor: "#d1ffd6" },
});