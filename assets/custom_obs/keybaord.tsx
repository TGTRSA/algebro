import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type KeyboardKey = {
  label: string;
  value?: string;
  type?: "text" | "command";
};

type CustomKeyboardProps = {
  layout: (string | KeyboardKey)[][];
  onKeyPress: (key: string, type?: string) => void;
  onDismiss?: () => void;  // Optional dismiss handler
};

export const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
  onKeyPress,
  layout,
  onDismiss,
}) => {
  const insets = useSafeAreaInsets();

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
    <SafeAreaView 
      style={[
        styles.safeArea,
        { paddingBottom: insets.bottom } // Add bottom padding for home indicator/navigation bar
      ]}
      edges={['bottom']} // Only apply safe area to bottom edge
    >
      <View style={styles.container}>
        {/* Optional dismiss button row */}
        {onDismiss && (
          <View style={styles.header}>
            <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
              <Text style={styles.dismissText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Keyboard rows */}
        {layout.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((key, keyIndex) => {
              const normalized = normalizeKey(key);
              return (
                <TouchableOpacity
                  key={`${normalized.label}-${keyIndex}`}
                  style={styles.key}
                  onPress={() => onKeyPress(normalized.value || normalized.label, normalized.type)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.keyText}>{normalized.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#D3D3D3",
  },
  container: {
    backgroundColor: "#D3D3D3",
    padding: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: "#D3D3D3",
  },
  dismissButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#BEBEBE",
    borderRadius: 8,
  },
  dismissText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
  key: {
    backgroundColor: "white",
    padding: 5,
    minWidth: 45,
    alignItems: "center",
    marginHorizontal: 3,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  keyText: {
    fontSize: 18,
  },
});