import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { PieChart } from "react-native-chart-kit";


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

const screenWidth = Dimensions.get("window").width;

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
];

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

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
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
    <body style="margin:0;padding:12px;background:white;display:flex;justify-content:center;align-items:center;">
      <div id="math"></div>

      <script>
        katex.render(
          "${expression.replace(/\\/g, "\\\\")}",
          document.getElementById('math'),
          {
            displayMode: true,
            throwOnError: false
          }
        );
      </script>
    </body>
    </html>
  `;

  return (
    <WebView
      source={{ html }}
      style={{ height: 80 }}
      scrollEnabled={false}
    />
  );
};

export default function ExponentsPage() {
  const [visibleChart, setVisibleChart] = useState(false);
  const [latex, setLatex] = useState("");
  const [equations, setEquations] = useState<Equation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [currentKeyboard, setCurrentKeyboard] =
    useState<"main" | "symbols">("main");

  const textInputRef = useRef<TextInput>(null);

  const [message, setMessage] = useState("");
  const [input, setInput] = useState("Expo");


  // LOAD QUESTIONS
  useEffect(() => {
    const data = rawData as EquationSet;

    if (data?.equations) {
      setEquations(data.equations);
    }
  }, []);

  if (equations.length === 0) {
    return <Text>Loading...</Text>;
  }

  const current = equations[currentIndex];

  const handleKeyPress = (key: string, type?: string) => {
    if (key === "delete" || type === "command") {
      setLatex((prev) => prev.slice(0, -1));
    } else {
      setLatex((prev) => prev + key);
    }
  };

  const checkAnswer = () => {
    const normalize = (s: string) =>
      s.replace(/\s/g, "").toLowerCase();

    if (normalize(latex) === normalize(current.answer)) {
      progressData.basic.correct += 1;

      alert("Correct 🎉");
      setShowAnswer(false);
    } else {
      alert(`Incorrect. Correct answer: ${current.answer}`);
      setShowAnswer(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < equations.length) {
      setCurrentIndex(currentIndex + 1);
      setLatex("");
      setShowAnswer(false);
    } else {
      alert("Completed!");
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
    setCurrentKeyboard(
      currentKeyboard === "main" ? "symbols" : "main"
    );
  };

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
        contentContainerStyle={{
          paddingBottom: isKeyboardVisible ? 420 : 20,
        }}
      >


        {/* STATISTICS BUTTON */}
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setVisibleChart(true)}
        >
          <Text style={styles.infoButtonText}>
            📊 Statistics
          </Text>
        </TouchableOpacity>

        {/* MODAL */}
        <Modal
          visible={visibleChart}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => setVisibleChart(false)}
              >
                <Text style={{ fontSize: 20 }}>✕</Text>
              </TouchableOpacity>

              {pieChartData.map((level, index) => {
                const pieData = [
                  {
                    name: "Correct",
                    count: level.correct,
                    color: "#4CAF50",
                    legendFontColor: "#000",
                    legendFontSize: 12,
                  },
                  {
                    name: "Incorrect",
                    count: level.incorrect,
                    color: "#FF6B6B",
                    legendFontColor: "#000",
                    legendFontSize: 12,
                  },
                ];

                return (
                  <View key={index}>
                    <Text>{level.name}</Text>

                    <PieChart
                      data={pieData}
                      width={screenWidth - 80}
                      height={200}
                      chartConfig={chartConfig}
                      accessor="count"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </Modal>

        {/* HEADER */}
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

        {/* QUESTION */}
        <View style={styles.questionCard}>
          <Text style={styles.descriptionText}>
            {current.description}
          </Text>

          <KatexWebView expression={current.eq} />
        </View>

        {/* ANSWER */}
        <View style={styles.answerCard}>
          <TouchableOpacity onPress={focusTextInput}>
            <TextInput
              ref={textInputRef}
              style={styles.mathInput}
              value={latex}
              editable={false}
              multiline
            />
          </TouchableOpacity>

          {latex ? (
            <KatexWebView expression={latex} />
          ) : null}

          {showAnswer ? (
            <KatexWebView expression={current.answer} />
          ) : null}

          <TouchableOpacity
            style={styles.checkButton}
            onPress={checkAnswer}
          >
            <Text style={styles.buttonText}>
              Check Answer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.buttonText}>
              Next Question
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.previousButton}
            onPress={handlePreviousQuestion}
          >
            <Text style={styles.buttonText}>
              Previous Question
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CUSTOM KEYBOARD */}
      {isKeyboardVisible && (
        <View style={styles.customKeyboardContainer}>
          <View style={styles.keyboardHeader}>
            <TouchableOpacity
              onPress={toggleKeyboard}
              style={styles.switchButton}
            >
              <Text style={styles.switchButtonText}>
                Switch
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={dismissKeyboard}
              style={styles.dismissButton}
            >
              <Text style={styles.dismissText}>Done</Text>
            </TouchableOpacity>
          </View>

          <CustomKeyboard
            layout={
              currentKeyboard === "main"
                ? advancedLayout
                : symbolsLayout
            }
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
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#8B4513",
  },

  backButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 10,
  },

  backText: {
    color: "#000",
  },

  placeholder: {
    width: 60,
  },

  questionCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  answerCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
  },

  descriptionText: {
    fontSize: 18,
    marginBottom: 20,
  },

  mathInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    minHeight: 80,
    padding: 10,
    marginBottom: 20,
  },

  checkButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  nextButton: {
    backgroundColor: "#8B4513",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  previousButton: {
    backgroundColor: "gray",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  customKeyboardContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },

  keyboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  switchButton: {
    backgroundColor: "#8B4513",
    padding: 10,
    borderRadius: 10,
  },

  switchButtonText: {
    color: "white",
  },

  dismissButton: {
    backgroundColor: "#8B4513",
    padding: 10,
    borderRadius: 10,
  },

  dismissText: {
    color: "white",
  },

  infoButton: {
    backgroundColor: "#8B4513",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },

  infoButtonText: {
    color: "white",
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 20,
    padding: 20,
  },
});