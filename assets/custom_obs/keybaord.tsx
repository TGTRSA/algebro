import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";

export type KeyboardKey = {
  label: string;
  value?: string;
  type?: "text" | "command" | "special";
  width?: number;
};

type CustomKeyboardProps = {
  // Allow mixed arrays (strings OR KeyboardKey objects)
  layout: (string | KeyboardKey)[][];
  onKeyPress: (key: string, type?: string) => void;

  // Optional styling props
  keyStyle?: ViewStyle;
  keyTextStyle?: TextStyle;
  rowStyle?: ViewStyle;
  containerStyle?: ViewStyle;

  // Optional behavior props
  showDeleteKey?: boolean;
  deleteKeyLabel?: string;
  showClearKey?: boolean;
  clearKeyLabel?: string;
  showSpaceKey?: boolean;
  spaceKeyLabel?: string;

  // Optional callbacks
  onDelete?: () => void;
  onClear?: () => void;
  onSpace?: () => void;

  // Visual props
  activeKeyColor?: string;
  inactiveKeyColor?: string;
  textColor?: string;
  keyBorderRadius?: number;
  keySpacing?: number;
};

export const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
  onKeyPress,
  layout,
  keyStyle,
  keyTextStyle,
  rowStyle,
  containerStyle,
  showDeleteKey = true,
  deleteKeyLabel = "⌫",
  showClearKey = false,
  clearKeyLabel = "Clear",
  showSpaceKey = false,
  spaceKeyLabel = "Space",
  onDelete,
  onClear,
  onSpace,
  activeKeyColor = "#ddd",
  inactiveKeyColor = "#f0f0f0",
  textColor = "#333",
  keyBorderRadius = 8,
  keySpacing = 5,
}) => {
  const handleKeyPress = (key: string, type?: string) => {
    if (type === "command") {
      if (key === "delete" && onDelete) {
        onDelete();
      } else if (key === "clear" && onClear) {
        onClear();
      } else if (key === "space" && onSpace) {
        onSpace();
      }
    }
    onKeyPress(key, type);
  };

  const normalizeKey = (key: string | KeyboardKey): KeyboardKey => {
    if (typeof key === "string") {
      // Auto-detect special keys
      let type: "text" | "command" | "special" = "text";
      let label = key;
      let value = key;

      if (key === "del" || key === "⌫") {
        type = "command";
        label = deleteKeyLabel;
        value = "delete";
      } else if (key === "clear") {
        type = "command";
        label = clearKeyLabel;
        value = "clear";
      } else if (key === "space") {
        type = "command";
        label = spaceKeyLabel;
        value = "space";
      }

      return { label, value, type };
    }
    return key;
  };

  const renderKey = (keyItem: string | KeyboardKey, index: number) => {
    const key = normalizeKey(keyItem);
    const isCommand = key.type === "command";

    return (
      <TouchableOpacity
        key={`${key.label}-${index}`}
        onPress={() => handleKeyPress(key.value || key.label, key.type)}
        style={[
          styles.key,
          {
            backgroundColor: isCommand ? activeKeyColor : inactiveKeyColor,
            borderRadius: keyBorderRadius,
            margin: keySpacing / 2,
            minWidth: key.width || 50,
          },
          keyStyle,
          isCommand && styles.commandKey,
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.keyText,
            { color: textColor },
            isCommand && styles.commandKeyText,
            keyTextStyle,
          ]}
        >
          {key.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {layout.map((row, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={[styles.row, { marginBottom: keySpacing }, rowStyle]}
        >
          {row.map((key, keyIndex) => renderKey(key, keyIndex))}
        </View>
      ))}

      {/* Additional control row for common commands */}
      {(showDeleteKey || showClearKey || showSpaceKey) && (
        <View
          style={[styles.row, styles.controlRow, { marginTop: keySpacing }]}
        >
          {showClearKey && (
            <TouchableOpacity
              onPress={() => handleKeyPress("clear", "command")}
              style={[
                styles.key,
                styles.controlKey,
                { backgroundColor: "#ff6b6b", borderRadius: keyBorderRadius },
              ]}
            >
              <Text style={[styles.keyText, styles.controlKeyText]}>
                {clearKeyLabel}
              </Text>
            </TouchableOpacity>
          )}
          {showSpaceKey && (
            <TouchableOpacity
              onPress={() => handleKeyPress("space", "command")}
              style={[
                styles.key,
                styles.spaceKey,
                {
                  backgroundColor: activeKeyColor,
                  borderRadius: keyBorderRadius,
                },
              ]}
            >
              <Text style={[styles.keyText, { color: textColor }]}>
                {spaceKeyLabel}
              </Text>
            </TouchableOpacity>
          )}
          {showDeleteKey && (
            <TouchableOpacity
              onPress={() => handleKeyPress("delete", "command")}
              style={[
                styles.key,
                styles.controlKey,
                { backgroundColor: "#ff6b6b", borderRadius: keyBorderRadius },
              ]}
            >
              <Text style={[styles.keyText, styles.controlKeyText]}>
                {deleteKeyLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  controlRow: {
    marginTop: 5,
  },
  key: {
    padding: 16,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commandKey: {
    backgroundColor: "#ddd",
    minWidth: 70,
  },
  commandKeyText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  controlKey: {
    backgroundColor: "#ff6b6b",
    minWidth: 80,
  },
  controlKeyText: {
    color: "white",
    fontWeight: "bold",
  },
  spaceKey: {
    flex: 1,
    minWidth: 150,
  },
  keyText: {
    fontSize: 20,
    textAlign: "center",
  },
});
