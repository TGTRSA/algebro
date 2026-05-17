import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { PieChart } from 'react-native-chart-kit';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import progressData from "../assets/progress/expansion.json";
import rawData from "../assets/questions/algebra/exponents/expansion.json";
import { CustomKeyboard } from "../assets/custom_obs/keybaord";

const screenWidth = Dimensions.get('window').width;

// FIRST KEYBOARD LAYOUT
const advancedLayout = [
  [
    { label: "∫", value: "\\int", type: "special" },
    { label: "x", value: "x", type: "text" },
    { label: "^", value: "^", type: "special", width: 20 },
    { label: "⌫", value: "delete", type: "command", width: 20 },
  ],
  [
    { label: "7", value: "7", type: "text" },
    { label: "8", value: "8", type: "text" },
    { label: "9", value: "9", type: "text" },
    { label: "frac", value: "\\frac{}{}", type: "special", width: 20 },
  ],
  [
    { label: "4", value: "4", type: "text" },
    { label: "5", value: "5", type: "text" },
    { label: "6", value: "6", type: "text" },
    { label: "√", value: "\\sqrt{}", type: "special", width: 20 },
  ],
  [
    { label: "1", value: "1", type: "text" },
    { label: "2", value: "2", type: "text" },
    { label: "3", value: "3", type: "text" },
    { label: "π", value: "\\pi", type: "special", width: 20 },
  ],
  [
    { label: "0", value: "0", type: "text" },
    { label: "(", value: "(", type: "text" },
    { label: ")", value: ")", type: "text" },
    { label: "*", value: "\\cdot", type: "text", width: 20 },
  ],
  [
    {label: " ", value: " ", type:"text", width: 80},
  ]
];

// SECOND KEYBOARD LAYOUT - SYMBOLS LAYOUT
const symbolsLayout = [
  [
    { label: "∑", value: "\\sum", type: "special", width: 20 },
    { label: "∫", value: "\\int", type: "special", width: 20 },
    { label: "∏", value: "\\prod", type: "special", width: 20 },
    { label: "√", value: "\\sqrt{}", type: "special", width: 20 },
  ],
  [
    { label: "α", value: "\\alpha", type: "special", width: 20 },
    { label: "β", value: "\\beta", type: "special", width: 20 },
    { label: "γ", value: "\\gamma", type: "special", width: 20 },
    { label: "δ", value: "\\delta", type: "special", width: 20 },
  ],
  [
    { label: "∞", value: "\\infty", type: "special", width: 20 },
    { label: "∂", value: "\\partial", type: "special", width: 20 },
    { label: "∇", value: "\\nabla", type: "special", width: 20 },
    { label: "∈", value: "\\in", type: "special", width: 20 },
  ],
  [
    { label: "≤", value: "\\leq", type: "special", width: 20 },
    { label: "≥", value: "\\geq", type: "special", width: 20 },
    { label: "≠", value: "\\neq", type: "special", width: 20 },
    { label: "≈", value: "\\approx", type: "special", width: 20 },
  ],
  [
    { label: "⌫", value: "delete", type: "command", width: 20 },
  ],
];

interface Equation {
  eq: string;
  level: string;
  technique: string;
  description: string;
  answer: string;
}

interface EquationSet {
  equations: Equation[];
}

// Chart configuration for PieChart
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const KatexWebView = ({ expression }: { expression: string }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    </head>
    <body style="margin: 0; padding: 12px; background: white; display: flex; justify-content: center; align-items: center;">
      <div id="math"></div>
      <script>
        katex.render("${expression.replace(/\\/g, "\\\\")}", document.getElementById('math'), {
          displayMode: true,
          throwOnError: false
        });
      </script>
    </body>
    </html>
  `;
  return (
    <WebView source={{ html }} style={{ height: 80 }} scrollEnabled={false} />
  );
};

export default function ExponentsPage() {
  const [visibleChart, setVisibleChart] = useState(false);
  const [latex, setLatex] = useState("");
  const [equations, setEquations] = useState<Equation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [currentKeyboard, setCurrentKeyboard] = useState<'main' | 'symbols'>('main');
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const data = rawData as EquationSet;
    if (data?.equations) setEquations(data.equations);
  }, []);

  if (equations.length === 0) return <Text>Loading...</Text>;

  const current = equations[currentIndex];

  const handleKeyPress = (key: string, type?: string) => {
    if (key === "delete" || (type === "command" && key === "delete")) {
      setLatex((prev) => prev.slice(0, -1));
    } else {
      setLatex((prev) => prev + key);
    }
  };

  const checkAnswer = () => {
    const normalize = (s: string) => s.replace(/\s/g, "").toLowerCase();
    if (normalize(latex) === normalize(current.answer)) {
      alert("Correct! 🎉");
      setShowAnswer(false);
    } else {
      alert(`Incorrect. The correct answer is: ${current.answer}`);
      setShowAnswer(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < equations.length) {
      setCurrentIndex(currentIndex + 1);
      setLatex("");
      setShowAnswer(false);
    } else {
      alert("Congratulations! You've completed all questions!");
      router.back();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLatex("");
      setShowAnswer(false);
    }
  };

  const focusTextInput = () => {
    setIsKeyboardVisible(true);
    textInputRef.current?.focus();
  };

  const dismissKeyboard = () => {
    setIsKeyboardVisible(false);
    textInputRef.current?.blur();
  };

  const toggleKeyboard = () => {
    setCurrentKeyboard(currentKeyboard === 'main' ? 'symbols' : 'main');
  };

  // Prepare pie chart data for each level
  const pieChartData = [
    {
      name: progressData.basic.level,
      correct: progressData.basic.correct,
      incorrect: progressData.basic.incorrect,
    },
    {
      name: progressData.intermediate.level,
      correct: progressData.intermediate.correct,
      incorrect: progressData.intermediate.incorrect,
    },
    {
      name: progressData.advanced.level,
      correct: progressData.advanced.correct,
      incorrect: progressData.advanced.incorrect,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#FDF5E6" }}>
      <ScrollView
        style={{ flex: 1, padding: 20 }}
        contentContainerStyle={{ paddingBottom: isKeyboardVisible ? 420 : 20 }}
      >
        {/* Info Button with Modal */}
        <View style={styles.infoButtonContainer}>
          <TouchableOpacity 
            style={styles.infoButton} 
            onPress={() => setVisibleChart(true)}
          >
            <Text style={styles.infoButtonText}>📊 Statistics</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for Pie Chart */}
        <Modal
          visible={visibleChart}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setVisibleChart(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Progress Statistics</Text>
                <TouchableOpacity 
                  onPress={() => setVisibleChart(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView>
                {pieChartData.map((level, index) => {
                  // Only create chart if there's data
                  const hasData = level.correct > 0 || level.incorrect > 0;
                  
                  if (!hasData) {
                    return (
                      <View key={index} style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>{level.name}</Text>
                        <Text style={styles.noDataText}>No data available yet</Text>
                      </View>
                    );
                  }
                  
                  const pieData = [
                    {
                      name: `✅ Correct (${level.correct})`,
                      count: level.correct,
                      color: '#4CAF50',
                      legendFontColor: '#333',
                      legendFontSize: 12,
                    },
                    {
                      name: `❌ Incorrect (${level.incorrect})`,
                      count: level.incorrect,
                      color: '#FF6B6B',
                      legendFontColor: '#333',
                      legendFontSize: 12,
                    },
                  ];
                  
                  return (
                    <View key={index} style={styles.chartContainer}>
                      <Text style={styles.chartTitle}>{level.name}</Text>
                      <PieChart
                        data={pieData}
                        width={screenWidth - 80}
                        height={200}
                        chartConfig={chartConfig}
                        accessor="count"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute={true}
                        hasLegend={true}
                      />
                      <View style={styles.statsRow}>
                        <Text style={styles.correctText}>✅ Correct: {level.correct}</Text>
                        <Text style={styles.incorrectText}>❌ Incorrect: {level.incorrect}</Text>
                        <Text style={styles.totalText}>📊 Total: {level.correct + level.incorrect}</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Header with Title */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Algebra</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{current.level}</Text>
            </View>
            <Text style={styles.techniqueText}>{current.technique}</Text>
          </View>

          <Text style={styles.descriptionText}>{current.description}</Text>

          <View style={styles.equationContainer}>
            <KatexWebView expression={current.eq} />
          </View>
        </View>

        {/* Answer Card */}
        <View style={styles.answerCard}>
          <Text style={styles.sectionTitle}>Your Answer</Text>

          <TouchableOpacity onPress={focusTextInput} activeOpacity={0.7}>
            <TextInput
              ref={textInputRef}
              style={styles.mathInput}
              value={latex}
              placeholder="Tap here to show keyboard..."
              placeholderTextColor="#999"
              editable={true}
              showSoftInputOnFocus={false}
              multiline
            />
          </TouchableOpacity>

          {latex ? (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Preview:</Text>
              <View style={styles.katexContainer}>
                <KatexWebView expression={latex} />
              </View>
            </View>
          ) : null}

          {showAnswer && (
            <View style={styles.answerDisplayContainer}>
              <Text style={styles.answerDisplayLabel}>Correct Answer:</Text>
              <View style={styles.answerDisplayBox}>
                <KatexWebView expression={current.answer} />
              </View>
            </View>
          )}

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.checkButton]}
              onPress={checkAnswer}
            >
              <Text style={styles.buttonText}>✓ Check Answer</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleNextQuestion}
          >
            <Text style={styles.buttonText}>
              {currentIndex + 1 === equations.length
                ? "🏁 Finish"
                : "→ Next Question"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={currentIndex === 0}
            style={[
              styles.button,
              styles.previousButton,
              currentIndex === 0 && styles.disabledButton,
            ]}
            onPress={handlePreviousQuestion}
          >
            <Text style={styles.buttonText}>← Previous Question</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Custom Keyboard */}
      {isKeyboardVisible && (
        <View style={styles.customKeyboardContainer}>
          <View style={styles.keyboardHeader}>
            <TouchableOpacity onPress={toggleKeyboard} style={styles.switchButton}>
              <Text style={styles.switchButtonText}>
                {currentKeyboard === 'main' ? '🔣 Symbols' : '🔤 Main'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={dismissKeyboard} style={styles.dismissButton}>
              <Text style={styles.dismissText}>Done</Text>
            </TouchableOpacity>
          </View>
          <CustomKeyboard 
            layout={currentKeyboard === 'main' ? advancedLayout : symbolsLayout}
            onKeyPress={handleKeyPress}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#8B4513",
    letterSpacing: 0.5,
  },
  backButton: {
    backgroundColor: "rgba(139, 69, 19, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backText: {
    color: "#8B4513",
    fontSize: 16,
    fontWeight: "600",
  },
  placeholder: {
    width: 60,
  },
  infoButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  infoButton: {
    backgroundColor: "rgba(139, 69, 19, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoButtonText: {
    color: "#8B4513",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8D5B7",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F5E6D3",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#8B4513",
    fontWeight: "bold",
  },
  chartContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#FDF8F2",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0E0D0",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B4513",
    textAlign: "center",
    marginBottom: 12,
  },
  statsRow: {
    marginTop: 12,
    alignItems: "center",
    gap: 4,
  },
  correctText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  incorrectText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  totalText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  noDataText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    padding: 20,
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  levelBadge: {
    backgroundColor: "#F5E6D3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelText: {
    color: "#8B4513",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  techniqueText: {
    color: "#A0522D",
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "italic",
  },
  descriptionText: {
    fontSize: 16,
    color: "#2C1810",
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: "500",
  },
  equationContainer: {
    borderRadius: 16,
    padding: 24,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0E0D0",
  },
  answerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8B4513",
    marginBottom: 16,
  },
  mathInput: {
    borderWidth: 2,
    borderColor: "#E8D5B7",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontFamily: "monospace",
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    color: "#2C1810",
    minHeight: 100,
    textAlignVertical: "top",
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B4513",
    marginBottom: 8,
  },
  katexContainer: {
    backgroundColor: "#FDF8F2",
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0E0D0",
  },
  answerDisplayContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#F0F9F0",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  answerDisplayLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 12,
  },
  answerDisplayBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkButton: {
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  nextButton: {
    backgroundColor: "#8B4513",
    shadowColor: "#8B4513",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  previousButton: {
    backgroundColor: "#6d6d6d",
    shadowColor: "#6d6d6d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  customKeyboardContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E8D5B7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  keyboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8D5B7",
    backgroundColor: "#F5E6D3",
  },
  switchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#8B4513",
    borderRadius: 8,
  },
  switchButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  dismissButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#8B4513",
    borderRadius: 8,
  },
  dismissText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});