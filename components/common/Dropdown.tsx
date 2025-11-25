import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";
import React, { useMemo } from "react";
import ChevronDown from "./icons/ChevronDown";

interface DropdownProps {
  options: string[];
  onSelect: (option: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  minWidth?: number;
  defaultOption?: string;
  style?: ViewStyle; // Allow overriding container styles
}

export default function Dropdown({
  options,
  onSelect,
  onOpen,
  onClose,
  minWidth = 150, // Good default to prevent collapse
  defaultOption,
  style,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    defaultOption || null
  );

  // Toggle handler to clean up the logic
  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const handleSelect = (option: string) => {
    onSelect(option);
    setSelectedOption(option);
    setIsOpen(false);
    onClose?.();
  };

  // Calculate widest text once when options change, not every render
  // (Optional: Only keep this if you absolutely need the box to match the widest text)
  const widestOption = useMemo(() => {
    return options.reduce((a, b) => (a.length > b.length ? a : b), "");
  }, [options]);

  return (
    <View style={[styles.container, { minWidth, zIndex: isOpen ? 1000 : 1 }, style]}>
      <Pressable onPress={handleToggle} style={styles.header}>
        {/* We render the widest text invisibly to maintain width stability
           without hardcoding pixels.
        */}
        <Text style={[styles.text, styles.invisibleText]}>
            {selectedOption && selectedOption.length > widestOption.length
                ? selectedOption
                : widestOption}
        </Text>

        {/* The actual visible text overlaid on top */}
        <View style={styles.visibleTextContainer}>
             <Text style={styles.text} numberOfLines={1}>
                {selectedOption || "Select..."}
            </Text>
        </View>

        <ChevronDown width={30} height={30} color="#ffffff" />
      </Pressable>

      {/* Dropdown List */}
      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option, index) => (
            <Pressable
              key={`${option}-${index}`}
              onPress={() => handleSelect(option)}
              style={({ pressed }) => [
                styles.optionItem,
                pressed && styles.optionPressed // Visual feedback on press
              ]}
            >
              <Text style={styles.text}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}
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
  // Used to hold the layout width open
  invisibleText: {
    color: "transparent",
    height: 0, // Remove height impact
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
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 10,
    gap: 10
  },
  optionItem: {
    paddingVertical: 5,
  },
  optionPressed: {
    opacity: 0.7,
  }
});