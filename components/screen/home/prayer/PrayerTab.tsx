import { View } from "react-native";
import PersonalPrayers from "./personal/PersonalPrayers";
import PrayerTabHeader from "./PrayerTabHeader";
import SocialPrayers from "./social/SocialPrayers";
import { usePrayerModeStore } from "../../../../stores/PrayerModeStore";

export default function PrayerTab({ navigation }: any) {
    const prayerMode = usePrayerModeStore((state) => state.mode);
    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "flex-start",
                alignItems: "flex-start",
            }}
        >
            <View style={{ width: "100%" }}>
                <PrayerTabHeader />
            </View>
            <View style={{ flex: 1, width: "100%" }}>
                <View style={{ flex: 1, width: "100%" }}>
                    {prayerMode === "Personal" ? (
                        <PersonalPrayers navigation={navigation} />
                    ) : (
                        <SocialPrayers />
                    )}
                </View>
            </View>
        </View>
    );
}
