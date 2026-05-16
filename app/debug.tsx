import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import rawData from '../assets/questions/algebra/exponents/expansion.json';
import Katex from 'react-native-katex';
import { CustomKeyboard } from '@/assets/custom_obs/keybaord';

const advancedLayout = [
    [
        { label: 'x', value: 'x', type: 'text' },
        { label: 'y', value: 'y', type: 'text' },
        { label: 'Power', value: '^', type: 'special', width: 80 },
        { label: 'Sub', value: '_', type: 'special', width: 80 }
    ],
    [
        { label: '1', value: '1', type: 'text' },
        { label: '2', value: '2', type: 'text' },
        { label: '3', value: '3', type: 'text' },
        { label: 'Fraction', value: '\\frac{}{}', type: 'special', width: 100 }
    ]
]

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
  const [equations, setEquations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isZero, isNotZero] = useState(false);
  useEffect(() => {
    if (rawData?.equations) setEquations(rawData.equations);
  }, []);

  if (equations.length === 0) return <Text>Loading...</Text>;

  const current = equations[currentIndex];

  const handleKeyPress = (key: string) => {
    console.log(key);
  }

  return (
    <ScrollView style={{ flex: 2, padding: 20, backgroundColor: '#FDF5E6' }}>
      
      {/* Header with Title */}
       <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Algebra</Text>
          <View style={styles.placeholder} />
        </View>

      {/* Question Card
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 12, color: '#8B4513' }}>{current.level}</Text>
        <Text style={{ fontSize: 16, fontStyle: 'italic', marginVertical: 8 }}>{current.technique}</Text>
        <Text style={{ fontSize: 14, marginBottom: 16 }}>{current.description}</Text>
        <KatexWebView expression={current.eq} />
      </View> */}
     <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{current.level}</Text>
          </View>
          <Text style={styles.techniqueText}>{current.technique}</Text>
        </View>
        
        <Text style={styles.descriptionText}>{current.description}</Text>
        
        <View style={styles.equationContainer}>
          <KatexWebView expression={current.eq}/>
        </View>
      </View>

      {/* Answer Card */}
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Your Answer</Text>
        
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, minHeight: 80 }}
          value={latex}
          onChangeText={setLatex}
          placeholder="Enter answer..."
          multiline
        />
        {/* Live Preview */}
        {latex ? (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <View style={styles.katexContainer}>
              <KatexWebView
                expression={latex}
                // displayMode={true}
                // throwOnError={false}
                // errorColor="#cc0000"
              />
            </View>
          </View>
        ) : null}
        {/* {showAnswer && (
          <View style={{ marginTop: 16, padding: 12, backgroundColor: '#e8f5e9', borderRadius: 12 }}>
            <Text>Correct Answer:</Text>
            <KatexWebView expression={current.answer} />
          </View>
        )} */}

        <TouchableOpacity 
          style={{ backgroundColor: '#4CAF50', padding: 14, borderRadius: 12, marginTop: 20 }}
          onPress={() => {
            const normalize = (s: string) => s.replace(/\s/g, '').toLowerCase();
            if (normalize(latex) === normalize(current.answer)) {
              alert('Correct! 🎉');
            } else {
              alert(`Incorrect. Answer: ${current.answer}`);
              setShowAnswer(true);
            }
          }}>
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>✓ Check Answer</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ backgroundColor: '#8B4513', padding: 14, borderRadius: 12, marginTop: 12 }}
          onPress={() => {
            if (currentIndex + 1 < equations.length) {
              setCurrentIndex(currentIndex + 1);
              setLatex('');
              setShowAnswer(false);
            } else {
              alert('Complete!');
            }
          }}>
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>→ Next Question</Text>
        </TouchableOpacity>
       <TouchableOpacity 
          disabled={currentIndex == 0}
          style={{ backgroundColor: '#8B4513', padding: 14, borderRadius: 12, marginTop: 12 }}
          onPress={() => {
            setCurrentIndex(currentIndex - 1);
            setLatex('');
            setShowAnswer(false);
          }}>
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold'}}> Previous Question</Text>
        </TouchableOpacity>
        <CustomKeyboard 
          layout={advancedLayout}
          onKeyPress={handleKeyPress}
          activeKeyColor="#8B4513"
          inactiveKeyColor="#F5E6D3"
          textColor="#2C1810"
          keyBorderRadius={12}
          keySpacing={8}
          showDeleteKey={true}
          deleteKeyLabel="⌫ Delete"
          showClearKey={true}
          clearKeyLabel="Clear All"
          showSpaceKey={true}
          spaceKeyLabel="Space"
          onDelete={() => setLatex(prev => prev.slice(0, -1))}
          onClear={() => setLatex('')}
          onSpace={() => setLatex(prev => prev + ' ')}
          keyStyle={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
          }}
      />
          
      </View>
    </ScrollView>
    
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
    // backgroundColor: '#FDF8F2',
    borderRadius: 16,
    padding: 24,
    // alignItems: 'center',
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