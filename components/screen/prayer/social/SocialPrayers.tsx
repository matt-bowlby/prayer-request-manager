import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { usePrayerModeStore } from "../../../../stores/PrayerModeStore";

export default function SocialPrayers({ prayers }: { prayers?: Prayer[] }) {
    const mode = usePrayerModeStore((state) => state.mode);

    return (
        <View style={styles.container}>
            <Text>Social Prayers Component</Text>
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
