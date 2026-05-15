import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const API_URL = 'http://localhost:8000';

export default function DebugScreen() {
  const [latex, setLatex] = useState<string>('');
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const router = useRouter();

  const addDebugLog = (message: string) => {
    console.log(`[Expo] ${message}`);
    setDebugLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));
  };

  const testConnection = async () => {
    addDebugLog('Testing connection to Python backend...');
    
    try {
      const response = await fetch(`${API_URL}/api/test`);
      const data = await response.json();
      
      addDebugLog(`✅ Connection successful!`);
      addDebugLog(`📡 Python says: ${data.message}`);
      Alert.alert('Success', `Connected to Python!\n${data.message}`);
    } catch (error) {
      addDebugLog(`❌ Connection failed: ${error}`);
      Alert.alert('Error', 'Cannot connect to Python backend.\nMake sure it\'s running on port 8000');
    }
  };

  const sendToPython = async () => {
    if (!latex.trim()) {
      Alert.alert('No Input', 'Please enter something to send');
      return;
    }

    addDebugLog(`📤 Sending to Python: "${latex}"`);
    
    try {
      const response = await fetch(`${API_URL}/api/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_answer: latex,
          equation_id: 0
        })
      });
      
      const data = await response.json();
      
      addDebugLog(`📥 Received from Python:`);
      addDebugLog(`   Status: ${data.status}`);
      addDebugLog(`   Message: ${data.message}`);
      addDebugLog(`   Your answer: ${data.your_answer}`);
      
      Alert.alert('Python Response', data.message);
      
    } catch (error) {
      addDebugLog(`❌ Error sending to Python: ${error}`);
      Alert.alert('Error', 'Failed to communicate with Python backend');
    }
  };

  const clearLog = () => {
    setDebugLog([]);
    addDebugLog('Debug log cleared');
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 18, color: '#fff' }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>🐍 Python Debug</Text>
            <TouchableOpacity onPress={clearLog}>
              <Text style={{ fontSize: 14, color: '#ff6b6b' }}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Connection Test Button */}
          <TouchableOpacity
            style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 20 }}
            onPress={testConnection}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              🔌 Test Python Connection
            </Text>
          </TouchableOpacity>

          {/* Input Area */}
          <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#fff' }}>
              Send to Python:
            </Text>
            
            <TextInput
              style={{ 
                borderWidth: 1, 
                borderColor: '#333', 
                borderRadius: 8, 
                padding: 12, 
                fontSize: 16,
                minHeight: 100,
                backgroundColor: '#fff',
                color: '#000'
              }}
              value={latex}
              onChangeText={setLatex}
              placeholder="Type anything to send to Python..."
              placeholderTextColor="#999"
              multiline
            />
            
            <TouchableOpacity
              style={{ backgroundColor: '#34C759', padding: 15, borderRadius: 8, marginTop: 10 }}
              onPress={sendToPython}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                📤 Send to Python
              </Text>
            </TouchableOpacity>
          </View>

          {/* Debug Log */}
          <View style={{ backgroundColor: '#0a0a0a', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#333' }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              🐛 Debug Log:
            </Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {debugLog.length === 0 ? (
                <Text style={{ color: '#666', fontFamily: 'monospace' }}>Waiting for activity...</Text>
              ) : (
                debugLog.map((log, i) => (
                  <Text key={i} style={{ color: '#0f0', fontSize: 12, fontFamily: 'monospace', marginBottom: 5 }}>
                    {log}
                  </Text>
                ))
              )}
            </ScrollView>
          </View>

          {/* Instructions */}
          <View style={{ marginTop: 20, padding: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
            <Text style={{ color: '#888', fontSize: 12 }}>
              💡 Make sure Python backend is running: cd backend && python main.py
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}