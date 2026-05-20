import React, { useState, useEffect } from 'react';
import { 
  View, Text, Button, ScrollView, StyleSheet, 
  ActivityIndicator, Alert, TextInput 
} from 'react-native';
import * as Network from 'expo-network';

const ip_server = "192.168.1.75";

interface Server {
    ip: string;
    port: string;
}
const desktop_server: Server = {ip: "192.168.1.67", port: "8888"};

export default function App() {
  const [serverUrl, setServerUrl] = useState('');
  const [localIp, setLocalIp] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocalIP();
  }, []);

  const getLocalIP = async () => {
    try {
      const ip = await Network.getIpAddressAsync();
      setLocalIp(ip);
      // Use your computer's actual IP address
      setServerUrl(`http://${ip}:8888`);
    } catch (error) {
      console.log('IP detection failed:', error);
    }
  };

  const queryServer = async () => {
    if (!serverUrl) {
      Alert.alert('Error', 'Please enter server URL');
      return;
    }
    
    setLoading(true);
    setResponse('Querying server...');
    
    try {
      const res = await fetch(serverUrl);
      const text = await res.text();
      
      setResponse(`
✅ CONNECTION SUCCESSFUL!

URL: ${serverUrl}
Status: ${res.status}
Response: ${text}
      `);
      
    } catch (error) {
      setResponse(`
❌ CONNECTION FAILED!

Error: ${error.message}

Make sure:
1. MHD server is running on your desktop
2. Both devices are on same WiFi
3. URL is correct: ${serverUrl}
      `);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚀 MHD Client</Text>
        <Text style={styles.subtitle}>Connect to Desktop Server</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📱 Your Device IP:</Text>
        <Text style={styles.ip}>{localIp || 'Detecting...'}</Text>
        <Text style={styles.hint}>Desktop server should be on same network</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🌐 Server URL:</Text>
        <TextInput 
          style={styles.input}
          value={serverUrl}
          onChangeText={setServerUrl}
          placeholder={desktop_server.ip}
        />
        <Text style={styles.hint}>Use your computer's local IP</Text>
      </View>

      <View style={styles.card}>
        <Button 
          title="QUERY MHD SERVER" 
          onPress={queryServer}
          disabled={loading}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📡 Response:</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0066cc" />
        ) : (
          <Text style={styles.response}>{response || 'Press button to query server'}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 10, fontSize: 16 },
  ip: { fontSize: 16, color: '#2e7d32', fontFamily: 'monospace' },
  hint: { fontSize: 12, color: '#666', marginTop: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, fontSize: 14 },
  response: { fontFamily: 'monospace', fontSize: 12, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5 }
});