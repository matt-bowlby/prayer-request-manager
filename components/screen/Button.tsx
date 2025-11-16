import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default function Button({ styleProps, textStyleProps, text, onPress }: { styleProps?: any, textStyleProps?: any, text?: string, onPress?: () => void }) {
    return (
        <TouchableOpacity style={[styles.button, styleProps]} onPress={onPress}>
            <Text style={[styles.buttonText, textStyleProps]}>{text || "Button"}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 99999,
        backgroundColor: 'rgb(255,255,255)',

    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});