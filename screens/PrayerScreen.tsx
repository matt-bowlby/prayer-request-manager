import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PersonalPrayers from "../components/screen/prayer/personal/PersonalPrayers";
import PrayerTab from "../components/screen/prayer/PrayerTab";
import SocialPrayers from "../components/screen/prayer/social/SocialPrayers";
import { usePrayerModeStore } from "../stores/PrayerModeStore";

export default function PrayerScreen({ navigation }: any) {
    const prayerMode = usePrayerModeStore((state) => (state.mode));
    return (
        <SafeAreaView
            style={{ width: "100%", height: "100%", paddingHorizontal: 20, paddingTop: 10 }}
        >
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                }}
            >
                <View style={{ width: "100%" }}>
                    <PrayerTab />
                </View>
                <View style={{ flex: 1, width: "100%" }}>
                    <View style={{ flex: 1, width: "100%" }}>
                        {
                            prayerMode === "Personal" ? <PersonalPrayers /> : <SocialPrayers />
                        }
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
