import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Katex from 'react-native-katex';
import rawData from "../../assets/questions/algebra/exponents/basic.json" with {type: 'json'};

interface Equation {
  eq: string;
  level: string;
}

interface EquationSet { 
  equations: Equation[];
}

export default function Algebra() {
  const [latex, setLatex] = useState<string>('x^2');
  const equations: EquationSet = rawData as EquationSet;
  const handleInputChange = (text: string): void => {
    setLatex(text);
  };

  return (
    <LinearGradient colors={['#FDF5E6', '#F5E6D3']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Algebra</Text>
          <Katex style={styles.questionsField} 
              expression={equations.equations[1].eq}
              displayMode={false}
              >

          </Katex>
          {/* Natural-looking math input area */}
          <View style={styles.mathInputContainer}>
            <Text style={styles.mathLabel}>Enter your math expression:</Text>
            
            {/* Editable input field */}
            <TextInput
              style={styles.mathInput}
              value={latex}
              onChangeText={handleInputChange}
              placeholder="Type math here... (x^2, \sqrt{x}, \frac{1}{2})"
              placeholderTextColor="#999"
              autoFocus={true}
              multiline
            />
            
            {/* Rendered math preview with KaTeX */}
            <View style={styles.mathPreview}>
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
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.nextText}> Next  </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#8B4513', 
    marginBottom: 20 
  },
  mathInputContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mathLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 10,
  },
  mathInput: {
    borderWidth: 1,
    borderColor: '#D4A574',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: 'monospace',
    backgroundColor: 'white',
    marginBottom: 20,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  mathPreview: {
    borderTopWidth: 1,
    borderTopColor: '#F0E0D0',
    paddingTop: 15,
  },
  previewLabel: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 10,
  },
  katexContainer: {
    backgroundColor: '#F9F5F0',
    borderRadius: 8,
    padding: 15,
    minHeight: 80,
    justifyContent: 'center',
  },
  backButton: { 
    backgroundColor: '#8B4513', 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 8, 
    marginTop: 20,
  },
  backText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  nextText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600', 
    textAlign: 'center',
  },
  questionsField: {
    backgroundColor: 'white',
    padding: 40,
    width: 180,
  },
});