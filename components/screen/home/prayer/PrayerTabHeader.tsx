import React, { useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { usePrayerModeStore } from "../../../../stores/PrayerModeStore";
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    interpolateColor,
} from "react-native-reanimated";

export default function PrayerTabHeader({ onPress }: { onPress?: (state: string) => void }) {
    let prayerMode = usePrayerModeStore((state) => state.mode);
    let setPrayerMode = usePrayerModeStore((state) => state.setPrayerMode);
    const personalAnim = useSharedValue(1);
    const socialAnim = useSharedValue(0);

    useEffect(() => {
        if (prayerMode === "Personal") {
            personalAnim.value = withTiming(1, { duration: 200 });
            socialAnim.value = withTiming(0, { duration: 200 });
        } else {
            personalAnim.value = withTiming(0, { duration: 200 });
            socialAnim.value = withTiming(1, { duration: 200 });
        }
    }, [prayerMode]);

    const personalContainerStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(personalAnim.value, [0, 1], ["#ffffff00", "#fff"]),
    }));

    const socialContainerStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(socialAnim.value, [0, 1], ["#ffffff00", "#fff"]),
    }));

    const personalTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(personalAnim.value, [0, 1], ["#fff", "#000"]),
    }));

    const socialTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(socialAnim.value, [0, 1], ["#fff", "#000"]),
    }));

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Pressable
                    style={{ flex: 1, alignItems: "center" }}
                    onPress={() => {
                        setPrayerMode("Personal");
                        onPress?.("Personal");
                    }}
                >
                    <Animated.View style={[styles.labelContainer, personalContainerStyle]}>
                        <Animated.Text style={[styles.label, personalTextStyle]}>
                            Personal
                        </Animated.Text>
                    </Animated.View>
                </Pressable>
                <Pressable
                    style={{ flex: 1, alignItems: "center" }}
                    onPress={() => {
                        setPrayerMode("Social");
                        onPress?.("Social");
                    }}
                >
                    <Animated.View style={[styles.labelContainer, socialContainerStyle]}>
                        <Animated.Text style={[styles.label, socialTextStyle]}>
                            Social
                        </Animated.Text>
                    </Animated.View>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    label: {
        fontFamily: "Archivo",
        fontSize: 20,
    },
    labelContainer: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 99999,
    },
});
