import { StyleSheet, Pressable, Text } from "react-native";

export default function Button({ styleProps, onPress, children }: { styleProps?: any, onPress?: () => void, children?: React.ReactNode }) {
    return (
        <Pressable style={[styles.button, styleProps]} onPress={onPress}>
            {children}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 99999,
        backgroundColor: 'rgb(255,255,255)',
    }
});