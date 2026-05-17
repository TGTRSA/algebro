import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard, Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import rawData from '../assets/questions/algebra/exponents/expansion.json';
import progressData from '../assets/progress/progress_data.json';
import { CustomKeyboard } from '@/assets/custom_obs/keybaord';
import Katex from 'react-native-katex';

const advancedLayout1 = [
    [
      { label: 'di', value: '\\frac{}{}', type: 'special'},
      { label: 'x', value: '\\cdot', type: 'special'},
      { label: 'x', value: '\\cdot', type: 'special', width: 20 },
      { label: '⌫', value: 'delete', type: 'command', width: 20 },

    ],
    // [
    //     { label: 'x', value: 'x', type: 'text' },
    //     { label: 'y', value: 'y', type: 'text' },
    //     { label: '^', value: '^', type: 'special', width: 20 },
    //     { label: '-', value: '_', type: 'special', width: 20 }
    // ],
    [
        { label: '7', value: '7', type: 'text' },
        { label: '8', value: '8', type: 'text' },
        { label: '9', value: '9', type: 'text' },
        { label: '--', value: '\\frac{}{}', type: 'special', width: 20 }
    ],
    [
        { label: '4', value: '4', type: 'text' },
        { label: '5', value: '5', type: 'text' },
        { label: '6', value: '6', type: 'text' },
        { label: '√', value: '\\sqrt{}', type: 'special', width: 20 }
    ],
    [
        { label: '1', value: '1', type: 'text' },
        { label: '2', value: '2', type: 'text' },
        { label: '3', value: '3', type: 'text' },
        { label: 'π', value: '\\pi', type: 'special', width: 20 }
    ],
    [
        { label: '.', value: '0', type: 'text' },
        { label: '0', value: '(', type: 'text' },
        { label: '=', value: ')', type: 'text' },
        { label: '/', value: 'delete', type: 'command', width: 20 }
    ]
];
const symbolsLayout = [
  [
    {label: <Katex expression='\int'/>, value: '\\int', type: 'special', width:20},
  ],
  [

  ]
];
interface Equation {
  eq: string;
  level: string;
  technique: string;
  description: string;
  answer: string;
}
interface Topic { 
    name: string[],
};
interface TopicPorgress {
  topic: Topic,
}
interface EquationSet { 
  equations: Equation[];
}

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

export default function ExponentsPage() {
  const [latex, setLatex] = useState('');
  const [equations, setEquations] = useState<Equation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const [topicsdata, setData] = useState<TopicPorgress[]>([]); 


  useEffect(() => {
    const progdata = progressData as TopicPorgress;
    const data = rawData as EquationSet;
    if (data?.equations) setEquations(data.equations);
  }, []);

  if (equations.length === 0) return <Text>Loading...</Text>;

  const current = equations[currentIndex];

  const handleKeyPress = (key: string, type?: string) => {
    if (key === 'delete' || (type === 'command' && key === 'delete')) {
      setLatex(prev => prev.slice(0, -1));
    } else {
      setLatex(prev => prev + key);
    }
  };

  const checkAnswer = () => {
    const normalize = (s: string) => s.replace(/\s/g, '').toLowerCase();
    if (normalize(latex) === normalize(current.answer)) {
      alert('Correct! 🎉');
    } else {
      alert(`Incorrect. The correct answer is: ${current.answer}`);
      setShowAnswer(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < equations.length) {
      setCurrentIndex(currentIndex + 1);
      setLatex('');
      setShowAnswer(false);
    } else {
      alert('Congratulations! You\'ve completed all questions!');
      router.back();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLatex('');
      setShowAnswer(false);
    }
  };

  const focusTextInput = () => {
    // Show custom keyboard
    setIsKeyboardVisible(true);
    // Focus the TextInput to show cursor but prevent system keyboard
    textInputRef.current?.focus();
  };

  const dismissKeyboard = () => {
    setIsKeyboardVisible(false);
    textInputRef.current?.blur();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FDF5E6' }}>
      <ScrollView 
        style={{ flex: 1, padding: 20 }}
        contentContainerStyle={{ paddingBottom: isKeyboardVisible ? 320 : 20 }} // Add space when keyboard is visible
      >
        {/* Header with Title */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
          
          {/* TextInput - tap this to show custom keyboard */}
          <TouchableOpacity onPress={focusTextInput} activeOpacity={0.7}>
            <View pointerEvents="none"> {/* Make TextInput non-editable directly */}
              <TextInput
                ref={textInputRef}
                style={styles.mathInput}
                value={latex}
                placeholder="Tap here to show keyboard..."
                placeholderTextColor="#999"
                editable={false} // Make it non-editable to prevent system keyboard
                showSoftInputOnFocus={false} // Prevent system keyboard
                multiline
              />
            </View>
          </TouchableOpacity>
          
          {/* Live Preview */}
          {latex ? (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Preview:</Text>
              <View style={styles.katexContainer}>
                <KatexWebView expression={latex} />
              </View>
            </View>
          ) : null}

          {/* Answer Display */}
          {showAnswer && (
            <View style={styles.answerDisplayContainer}>
              <Text style={styles.answerDisplayLabel}>Correct Answer:</Text>
              <View style={styles.answerDisplayBox}>
                <KatexWebView expression={current.answer} />
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.button, styles.checkButton]} onPress={checkAnswer}>
              <Text style={styles.buttonText}> Check Answer</Text>
            </TouchableOpacity>
            
            {/* <TouchableOpacity style={[styles.button, styles.hintButton]} onPress={() => setShowAnswer(true)}>
              <Text style={styles.buttonText}>💡 Show Answer</Text>
            </TouchableOpacity> */}
          </View>

          <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNextQuestion}>
            <Text style={styles.buttonText}>
              {currentIndex + 1 === equations.length ? '🏁 Finish' : '→ Next Question'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            disabled={currentIndex === 0}
            style={[styles.button, styles.previousButton, currentIndex === 0 && styles.disabledButton]} 
            onPress={handlePreviousQuestion}>
            <Text style={styles.buttonText}>← Previous Question</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Custom Keyboard - Slides up from bottom when visible */}
      {/* {isKeyboardVisible && (
        <View style={styles.customKeyboardContainer}>
          <View style={styles.keyboardHeader}>
            <TouchableOpacity onPress={dismissKeyboard} style={styles.dismissButton}>
              <Text style={styles.dismissText}>Done</Text>
            </TouchableOpacity>
          </View>
          <CustomKeyboard 
            layout={advancedLayout as any}
            onKeyPress={handleKeyPress}
          />
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 16,
    padding: 24,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  answerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
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
    marginBottom: 12,
  },
  previousButton: {
    backgroundColor: '#6d6d6d',
    shadowColor: '#6d6d6d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  customKeyboardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E8D5B7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  keyboardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5B7',
    backgroundColor: '#F5E6D3',
  },
  dismissButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8B4513',
    borderRadius: 8,
  },
  dismissText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});