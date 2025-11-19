import { View, Text, StyleSheet, FlatList } from "react-native";
import * as Random from "expo-crypto";
import { useEffect, useRef, useState } from "react";
import Prayer from "../Prayer";
import { usePrayerStore } from "../../../../../stores/PrayerStore";
import { create } from "zustand";

interface HeightStore {
    height: number;
    setHeight: (height: number) => void;
}

const useHeightStore = create<HeightStore>((set) => ({
    height: 200,
    setHeight: (height) => set({ height }),
}));

export default function PersonalPrayers({
    navigation
}: {
    navigation?: any;
}) {
    const prayers = usePrayerStore((state) => state.prayers);
    const { height, setHeight } = useHeightStore();

    return (
        <View style={styles.container}>
            <View
                onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
                style={{ flex: 1, width: "100%", gap: 10 }}
            >
                <FlatList
                    // optional: set initialScrollIndex if you prefer initial-only scrolling
                    // initialScrollIndex={initialIndex}
                    getItemLayout={(_data, index) => ({
                        length: height,
                        offset: height * index,
                        index,
                    })}
                    data={prayers}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                width: "100%",
                                height: height,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Prayer info={item} navigation={navigation} />
                        </View>
                    )}
                    keyExtractor={(item) => {
                        // ensure a string key; adapt if your item uses _id or id
                        // fallback to index-based deterministic ID if needed
                        return (item as any)?.id || (item as any)?._id || Math.random().toString();
                    }}
                    pagingEnabled
                    snapToInterval={height}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
