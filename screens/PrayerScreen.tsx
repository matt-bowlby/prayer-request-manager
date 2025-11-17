import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import PrayerTab from "../components/screen/prayer/PrayerTab";

export default function PrayerScreen({navigation}: any) {
	return (
		<SafeAreaView style={{ width: "100%", height: "100%", paddingHorizontal: 20, paddingTop: 10 }}>
            <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center"}}>
				<View style={{flex: 1, width: "100%",position: "absolute", top: 10, left: 0}}>
					<PrayerTab />
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
});