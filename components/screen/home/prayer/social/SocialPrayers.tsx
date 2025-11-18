import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { usePrayerModeStore } from "../../../../../stores/PrayerModeStore";

export default function SocialPrayers({ prayers }: { prayers?: Prayer[] }) {
    const mode = usePrayerModeStore((state) => state.mode);

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 25, fontWeight: "bold", color: "white" }}>
                Future home of the social prayers!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
