import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default function Button({ styleProps, text }: { styleProps?: any, text?: string }) {
    return (
        <TouchableOpacity style={[styles.button, styleProps]} onPress={() => alert('Button Pressed!')}>
            <Text style={styles.buttonText}>{text || "Button"}</Text>
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