import { View, Text, Pressable, StyleSheet, ViewStyle, Modal } from "react-native";
import React, { useState, useRef } from "react";
import ChevronDown from "./icons/ChevronDown";

interface DropdownProps {
    options: string[];
    onSelect: (option: string) => void;
    onOpen?: () => void;
    onClose?: () => void;
    defaultOption?: string;
    style?: ViewStyle; // Allow overriding container styles
}

export default function Dropdown({
    options,
    onSelect,
    onOpen,
    onClose,
    defaultOption,
    style,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(defaultOption || null);
    const [dropdownLayout, setDropdownLayout] = useState({
        top: 0,
        left: 0,
        width: 0,
    });
    const buttonRef = useRef<View>(null);

    // Toggle handler to clean up the logic
    const handleToggle = () => {
        if (isOpen) {
            setIsOpen(false);
            onClose?.();
        } else {
            buttonRef.current?.measure((_fx, _fy, width, height, px, py) => {
                setDropdownLayout({
                    top: py + height,
                    left: px,
                    width: width,
                });
                setIsOpen(true);
                onOpen?.();
            });
        }
    };

    const handleSelect = (option: string) => {
        onSelect(option);
        setSelectedOption(option);
        setIsOpen(false);
        onClose?.();
    };

    return (
        <View
            ref={buttonRef}
            style={[
                styles.container,
                {
                    zIndex: isOpen ? 1000 : 1,
                },
                style,
            ]}
        >
            <Pressable onPress={handleToggle} style={[styles.header, {borderBottomColor: isOpen ? "transparent" : "#ffffff"}]}>
                <View>
                    <Text style={styles.text} numberOfLines={1}>
                        {selectedOption || "Select..."}
                    </Text>
                </View>

                <ChevronDown width={30} height={30} color="#ffffff" />
            </Pressable>
            <Modal visible={isOpen} transparent animationType="none" onRequestClose={handleToggle}>
                <Pressable style={styles.overlay} onPress={handleToggle}>
                    <View
                        style={[
                            styles.dropdownList,
                            {
                                top: dropdownLayout.top,
                                left: dropdownLayout.left,
                                // width: dropdownLayout.width,
                                right: undefined,
                            },
                        ]}
                        onStartShouldSetResponder={() => true}
                    >
                        {options.map((option, index) => (
                            <Pressable
                                key={`${option}-${index}`}
                                onPress={() => handleSelect(option)}
                                style={({ pressed }) => [
                                    styles.optionItem,
                                    pressed && styles.optionPressed,
                                ]}
                            >
                                <Text style={styles.textOption}>{option}</Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff",
        paddingVertical: 5,
        gap: 5,
    },
    // Common text styling
    text: {
        fontFamily: "Archivo",
        fontSize: 30,
        fontWeight: "600",
        color: "#fff",
    },
    textOption: {
        fontFamily: "Archivo",
        fontSize: 30,
        fontWeight: "600",
        color: "#000",
    },
    visibleTextContainer: {
        position: "absolute",
        left: 0,
        right: 30, // Leave room for Chevron
    },
    dropdownList: {
        position: "absolute",
        top: "100%", // Puts it directly below the header
        left: 0,
        right: 0,
        borderRadius: 16,
        padding: 10,
        gap: 10,
        backgroundColor: "#fff",
    },
    optionItem: {
        paddingVertical: 5,
    },
    optionPressed: {
        opacity: 0.7,
    },
    overlay: {
        flex: 1,
    },
});
