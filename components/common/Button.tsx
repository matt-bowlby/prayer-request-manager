import { StyleSheet, Pressable, Text } from "react-native";

export default function Button({ styleProps, onPress, disabled, disabledStyleProps, children }: { styleProps?: any, onPress?: () => void, disabled?: boolean, disabledStyleProps?: any, children?: React.ReactNode }) {
    return (
        <Pressable style={[styles.button, styleProps, disabled && disabledStyleProps]} onPress={onPress} disabled={disabled}>
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