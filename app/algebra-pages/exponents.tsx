import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import Katex from 'react-native-katex';
import rawData from "../../assets/questions/algebra/basic/exponents.json" with {type: 'json'};

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
        katex.render("${expression.replace(/\\/g, '\\\\')}", document.getElementById('math'), {
          displayMode: true,
          throwOnError: false
        });
      </script>
    </body>
    </html>
  `;
  return <WebView source={{ html }} style={{ height: 80 }} scrollEnabled={false} />;
};


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

// Normalization helper: removes whitespace
const normalizeAnswer = (answer: string): string => {
  return answer.replace(/\s/g, '');
};

// Check if answers match
const isAnswerCorrect = (userAnswer: string, correctAnswer: string): boolean => {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
};

// Show result to user
const showResult = (
  isCorrect: boolean, 
  correctAnswer: string, 
  setShowAnswer: (show: boolean) => void
): void => {
  if (isCorrect) {
    alert('Correct! 🎉');
  } else {
    alert(`Incorrect. The correct answer is: ${correctAnswer}`);
    setShowAnswer(true);
  }
};

// Check if this is the last question
const isLastQuestion = (currentIndex: number, totalQuestions: number): boolean => {
  return currentIndex + 1 === totalQuestions;
};

// Handle completion
const handleCompletion = (router: any): void => {
  alert('Congratulations! You\'ve completed all questions!');
  router.back();
};

// ============================================
// THE COMPONENT (now much cleaner!)
// ============================================

export default function Algebra() {
  const [latex, setLatex] = useState<string>('');
  const equations: EquationSet = rawData as EquationSet;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // These need to stay inside because they use state setters
  const handleInputChange = (text: string): void => {
    setLatex(text);
  };

  const checkAnswer = (): void => {
    const correctAnswer = equations.equations[currentIndex].answer;
    const correct = isAnswerCorrect(latex, correctAnswer);
    showResult(correct, correctAnswer, setShowAnswer);
  };

  const showCorrectAnswer = (): void => {
    setShowAnswer(true);
  };

  const handleNextQuestion = (): void => {
    if (!isLastQuestion(currentIndex, equations.equations.length)) {
      setCurrentIndex(currentIndex + 1);
      setLatex('');
      setShowAnswer(false);
    } else {
      handleCompletion(router);
    }
  };

  return (
    <LinearGradient colors={['#FDF5E6', '#F5E6D3']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Algebra</Text>
            <View style={styles.placeholder} />
          </View>

          Question Card
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{equations.equations[currentIndex].level}</Text>
              </View>
              <Text style={styles.techniqueText}>{equations.equations[currentIndex].technique}</Text>
            </View>
            
            <Text style={styles.descriptionText}>{equations.equations[currentIndex].description}</Text>
            
            <View style={styles.equationContainer}>
              <Katex 
                expression={equations.equations[currentIndex].eq}
                displayMode={true}
                throwOnError={true}
              />
            </View>
          </View>

          {/* Answer Section Card */}
          <View style={styles.answerCard}>
            <Text style={styles.sectionTitle}>Your Answer</Text>
            
            <TextInput
              style={styles.mathInput}
              value={latex}
              onChangeText={handleInputChange}
              placeholder="Enter your answer here... (e.g., x^2)"
              placeholderTextColor="#999"
              autoFocus={true}
              multiline
            />
            
            {/* Live Preview */}
            {latex ? (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Preview:</Text>
                <View style={styles.katexContainer}>
                  <Katex
                    expression={latex}
                    displayMode={true}
                    throwOnError={false}
                    errorColor="#cc0000"
                  />
                </View>
              </View>
            ) : null}

            {/* Answer Display */}
            {showAnswer && (
              <View style={styles.answerDisplayContainer}>
                <Text style={styles.answerDisplayLabel}>Correct Answer:</Text>
                <View style={styles.answerDisplayBox}>
                  <Katex
                    expression={equations.equations[currentIndex].answer}
                    displayMode={true}
                  />
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={[styles.button, styles.checkButton]} onPress={checkAnswer}>
                <Text style={styles.buttonText}> Check Answer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.hintButton]} onPress={showCorrectAnswer}>
                <Text style={styles.buttonText}> Show Answer</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNextQuestion}>
              <Text style={styles.buttonText}>
                {isLastQuestion(currentIndex, equations.equations.length) ? ' Finish' : '→ Next Question'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { 
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  title: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: '#8B4513',
    letterSpacing: 0.5,
  },
  backButton: { 
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20,
  },
  backText: { 
    color: '#8B4513', 
    fontSize: 16, 
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  levelBadge: {
    backgroundColor: '#F5E6D3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelText: {
    color: '#8B4513',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  techniqueText: {
    color: '#A0522D',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  descriptionText: {
    fontSize: 16,
    color: '#2C1810',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '500',
  },
  equationContainer: {
    backgroundColor: '#FDF8F2',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  answerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 16,
  },
  mathInput: {
    borderWidth: 2,
    borderColor: '#E8D5B7',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontFamily: 'monospace',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    color: '#2C1810',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  katexContainer: {
    backgroundColor: '#FDF8F2',
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  answerDisplayContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F0F9F0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  answerDisplayLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  answerDisplayBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButton: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  hintButton: {
    backgroundColor: '#FF9800',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  nextButton: {
    backgroundColor: '#8B4513',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});