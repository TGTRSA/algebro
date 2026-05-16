import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type KeyboardKey = {
  label: string;
  value?: string;
  type?: "text" | "command";
};

type CustomKeyboardProps = {
  layout: (string | KeyboardKey)[][];
  onKeyPress: (key: string, type?: string) => void;
};

export const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
  onKeyPress,
  layout,
}) => {
  const normalizeKey = (key: string | KeyboardKey) => {
    if (typeof key === "string") {
      let value = key;
      let label = key;
      let type = "text";
      
      if (key === "⌫") {
        type = "command";
        value = "delete";
      }
      
      return { label, value, type };
    }
    return key;
  };

  return (
    <View style={styles.container}>
      {layout.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key, keyIndex) => {
            const normalized = normalizeKey(key);
            return (
              <TouchableOpacity
                key={`${normalized.label}-${keyIndex}`}
                style={styles.key}
                onPress={() => onKeyPress(normalized.value || normalized.label, normalized.type)}
              >
                <Text style={styles.keyText}>{normalized.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D3D3D3",
    padding: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
  key: {
    backgroundColor: "white",
    padding: 12,
    minWidth: 45,
    alignItems: "center",
    marginHorizontal: 3,
    borderRadius: 6,
  },
  keyText: {
    fontSize: 18,
  },
});