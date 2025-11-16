import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/screen/button";

export default function OnboardScreen() {
    return (
        <SafeAreaView style={{ width: "100%", height: "100%" }}>
            <View style={{ borderColor: "red", borderWidth: 1, flex: 1 }}>
                {/* <Button styleProps={{ position: 'absolute', bottom: 12, left: 12, right: 12 }} /> */}
            </View>
        </SafeAreaView>
    );
}
