import React, { forwardRef } from "react";
import {
    View,
    Text,
    TextInput,
    TextInputProps,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from "react-native";

type TextBoxProps = TextInputProps & {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    inputStyle?: TextStyle;
	onChangeText?: (text: string) => void;
};

const TextBox = forwardRef<TextInput, TextBoxProps>(
    ({ label, error, containerStyle, labelStyle, inputStyle, onChangeText, ...rest }, ref) => {
        return (
            <View style={[styles.container, containerStyle]}>
                {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
                <TextInput
                    ref={ref}
                    style={[inputStyle, error ? styles.inputError : undefined]}
                    {...rest}
					onChangeText={onChangeText}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginVertical: 6,
    },
    label: {
        marginBottom: 6,
        color: "#222",
        fontSize: 14,
    },
    inputError: {
        borderColor: "#E53935",
    },
    error: {
        marginTop: 6,
        color: "#E53935",
        fontSize: 12,
    },
});

export default TextBox;
