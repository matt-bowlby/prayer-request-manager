import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard } from "react-native";
import CreateTab from "../components/screen/home/create/CreateTab";
import { isOnboardingComplete } from "../storage/database";

export default function FirstCreateScreen({ navigation }: any) {
    return (
        <SafeAreaView
            style={{ width: "100%", height: "100%", paddingHorizontal: 20, paddingTop: 10 }}
        >
            <Pressable style={{ flex: 1 }} onPress={() => {
                Keyboard.dismiss();
                
            }}>
                <CreateTab title="First Prayer" onSubmit={() => navigation.navigate("Home")} />
            </Pressable>
        </SafeAreaView>
    );
}
