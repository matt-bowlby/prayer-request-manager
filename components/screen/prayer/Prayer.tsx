import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../common/Button";
import Pencil from '../../common/icons/Pencil';
import Plus from "../../common/icons/Plus";
import ChevronLeft from "../../common/icons/ChevronLeft";
import ChevronRight from "../../common/icons/ChevronRight";

export default function Prayer({ navigation, info }: { navigation: any, info?: any }) {
    return (
        <View style={{ width: "100%", gap: 10 }}>
            <View style={{ width: "100%", gap: 10 }}>
                <Text style={styles.title}>{info?.title}</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{info?.description}</Text>
                </View>
            </View>
            <View style={{ width: "100%", alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
                <ChevronLeft width={40} height={40} color="white" />
                <View style={{ flexDirection: "row", justifyContent: "center", gap: 40 }}>
                    <Button styleProps={{ padding: 5, borderRadius: 15, backgroundColor: "#ffffff44", borderWidth: 1, borderColor: "#ffffff55" }} onPress={() => {}}>
                        <Pencil width={24} height={24} color="white" />
                    </Button>
                    <Button styleProps={{ padding: 5, borderRadius: 15, backgroundColor: "#ffffff44", borderWidth: 1, borderColor: "#ffffff55" }} onPress={() => {}}>
                        <Plus width={24} height={24} color="white" />
                    </Button>
                </View>
                <ChevronRight width={40} height={40} color="white" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        width: "100%",
        borderTopWidth: 1,
        borderTopColor: "#ffffff45",
    },
    title: {
        color: "#ffffff",
        fontSize: 25,
        fontWeight: "900",
        textAlign: "left",
    },
    text: {
        color: "#ffffff",
        fontSize: 22,
        textAlign: "left",
    },
});
