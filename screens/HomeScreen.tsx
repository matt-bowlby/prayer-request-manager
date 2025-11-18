import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrayerTab from "../components/screen/home/prayer/PrayerTab";
import NavigationBar from "../components/common/NavigationBar";
import { useHomeStore } from "../stores/HomeStore";
import CreateTab from "../components/screen/home/create/CreateTab";

export default function HomeScreen({ navigation }: any) {
    const homeMode = useHomeStore((state) => state.homeMode);
    const setHomeMode = useHomeStore((state) => state.setHomeMode);
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
                <View style={{ flex: 1, width: "100%" }}>
                    {
                        homeMode === "Settings" ? (
                            // <SettingsTab />
                            <View />
                        ) : homeMode === "Create" ? (
                            <CreateTab onSubmit={() => {
                                setHomeMode("Prayer");
                                console.log("Submitted");
                            }} />
                        ) : homeMode === "Prayer" ? (
                            <PrayerTab navigation={navigation} />
                        ) : null
                    }
                </View>
                <View style={{ width: "100%", alignItems: "center" }}>
                    <NavigationBar onPress={(index) => {
                        if (index === 0 && homeMode !== "Settings") {
                            setHomeMode("Settings");
                        } else if (index === 1 && homeMode !== "Create") {
                            setHomeMode("Create");
                        } else if (index === 2 && homeMode !== "Prayer") {
                            setHomeMode("Prayer");
                        }
                    }} />
                </View>
            </View>
        </SafeAreaView>
    );
}
