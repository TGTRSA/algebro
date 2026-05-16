import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import rawData from '../assets/questions/algebra/exponents/expansion.json';

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

  useEffect(() => {
    if (rawData?.equations) setEquations(rawData.equations);
  }, []);

  if (equations.length === 0) return <Text>Loading...</Text>;

  const current = equations[currentIndex];

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#FDF5E6' }}>
      
      {/* Header with Title */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#8B4513' }}>Exponents</Text>
      </View>

      {/* Question Card */}
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 12, color: '#8B4513' }}>{current.level}</Text>
        <Text style={{ fontSize: 16, fontStyle: 'italic', marginVertical: 8 }}>{current.technique}</Text>
        <Text style={{ fontSize: 14, marginBottom: 16 }}>{current.description}</Text>
        <KatexWebView expression={current.eq} />
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
        
        {showAnswer && (
          <View style={{ marginTop: 16, padding: 12, backgroundColor: '#e8f5e9', borderRadius: 12 }}>
            <Text>Correct Answer:</Text>
            <KatexWebView expression={current.answer} />
          </View>
        )}

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
      </View>
    </ScrollView>
  );
}