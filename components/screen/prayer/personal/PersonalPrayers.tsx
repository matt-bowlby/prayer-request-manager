import { View, Text, StyleSheet, FlatList } from "react-native";
import * as Random from 'expo-crypto';
import { useEffect, useState } from "react";
import { usePrayerModeStore } from "../../../../stores/PrayerModeStore";
import Prayer from "../Prayer";
import { usePrayerStore } from "../../../../stores/PrayerStore";

export default function PersonalPrayers({navigation}: {navigation?: any}) {
    const getRandomPrayer = usePrayerStore((state) => state.getRandomPrayer);
    const [prayers, setPrayers] = useState<Object[]>([]);
    const mode = usePrayerModeStore((state) => state.mode);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const newPrayers: Object[] = [];
        for (let i = 0; i < 3; i++) {
            const p = getRandomPrayer();
            if (p) newPrayers.push({...p, _id: Random.getRandomBytes(16).toString()});
        }
        setPrayers(newPrayers);
    }, []);

    return (
        <View style={styles.container}>
            <View
                onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
                style={{ flex: 1, width: "100%", gap: 10 }}
            >
                <FlatList
                    data={prayers}
                    renderItem={({ item }) => <View style={{ width: "100%", height: height, justifyContent: "center", alignItems: "center"}}><Prayer info={item} navigation={navigation} /></View>}
                    keyExtractor={(item) => {
                        if (typeof item === "object" && item !== null && "_id" in item && typeof item._id === "string") {
                            return item._id;
                        }
                        return Math.random().toString();
                    }}
                    pagingEnabled
                    snapToInterval={height}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0.25}
                    onEndReached={(_) => {
                        const newPrayers: Object[] = [];
                        for (let i = 0; i < 3; i++) {
                            const p = getRandomPrayer();
                            if (p) newPrayers.push({...p, _id: Random.getRandomBytes(16).toString()});
                        }
                        setPrayers((prevPrayers) => [...prevPrayers, ...newPrayers]);
                    }}
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
