import { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Pressable, LayoutRectangle } from "react-native";
import Gear from "./icons/Gear";
import Home from "./icons/Home";
import Plus from "./icons/Plus";
import { useHomeStore } from "../../stores/HomeStore";

function homeModeToIndex(mode: "Settings" | "Prayer" | "Create"): number {
    if (mode === "Settings") return 0;
    if (mode === "Create") return 1;
    if (mode === "Prayer") return 2;
    return 0;
}

export default function NavigationBar({
    styleProps,
    onPress,
}: {
    styleProps?: any;
    onPress?: (index: number) => void;
}) {
    const homeMode = useHomeStore((state) => state.homeMode);
    const setHomeMode = useHomeStore((state) => state.setHomeMode);
    const [positions, setPositions] = useState<(LayoutRectangle | null)[]>([null, null, null]);
    const refs = [useRef<View>(null), useRef<View>(null), useRef<View>(null)];

    useEffect(() => {
        if (homeMode != null && refs[homeModeToIndex(homeMode)]?.current) {
            for (let i = 0; i < refs.length; i++) {
                if (refs[i]?.current) {
                    refs[i]?.current?.measureLayout(
                        // @ts-ignore
                        containerRef.current,
                        (x, y, width, height) => {
                            setPositions((prev) => {
                                const newPositions = [...prev];
                                newPositions[i] = { x, y, width, height };
                                return newPositions;
                            });
                        }
                    );
                }
            }
        }
    }, []);

    const containerRef = useRef<View>(null);

    return (
        <View ref={containerRef} style={[styles.container, styleProps]}>
            {positions[0] && (
                <Pressable
                    style={{
                        position: "absolute",
                        left: positions[0].x + positions[0].width / 2 - 41,
                        top: positions[0].y + positions[0].height / 2 - 41,
                        width: 80,
                        height: 80,
                        borderRadius: 9999,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                            homeMode !== "Settings" ? "transparent" : "rgba(255, 255, 255, 1)",
                    }}
                    onPress={() => {
                        setHomeMode("Settings");
                        onPress?.(0);
                    }}
                />
            )}
            {positions[1] && (
                <Pressable
                    style={{
                        position: "absolute",
                        left: positions[1]?.x + positions[1]?.width / 2 - 41,
                        top: positions[1]?.y + positions[1]?.height / 2 - 41,
                        width: 80,
                        height: 80,
                        borderRadius: 9999,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                            homeMode !== "Create" ? "transparent" : "rgba(255, 255, 255, 1)",
                    }}
                    onPress={() => {
                        setHomeMode("Create");
                        onPress?.(1);
                    }}
                />
            )}
            {positions[2] && (
                <Pressable
                    style={{
                        position: "absolute",
                        left: positions[2]?.x + positions[2]?.width / 2 - 41,
                        top: positions[2]?.y + positions[2]?.height / 2 - 41,
                        width: 80,
                        height: 80,
                        borderRadius: 9999,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                            homeMode !== "Prayer" ? "transparent" : "rgba(255, 255, 255, 1)",
                    }}
                    onPress={() => {
                        setHomeMode("Prayer");
                        onPress?.(2);
                    }}
                />
            )}

            <View ref={refs[0]} pointerEvents="none">
                <Gear width={30} height={30} color={homeMode === "Settings" ? "black" : "white"} />
            </View>
            <View ref={refs[1]} pointerEvents="none">
                <Plus width={30} height={30} color={homeMode === "Create" ? "black" : "white"} />
            </View>
            <View ref={refs[2]} pointerEvents="none">
                <Home width={30} height={30} color={homeMode === "Prayer" ? "black" : "white"} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgb(255, 255, 255, 0.3)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 99999,
        paddingHorizontal: 15,
        gap: 50,
        height: 64,
        alignItems: "center",
        flexDirection: "row",
    },
});
