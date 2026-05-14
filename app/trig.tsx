import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Trig() {
  return (
    <LinearGradient colors={['#FDF5E6', '#F5E6D3']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Trigonometry</Text>
          <Text style={styles.content}>Welcome to Trigonometry!</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#2E5E4E', marginBottom: 20 },
  content: { fontSize: 18, color: '#333', marginBottom: 40 },
  backButton: { backgroundColor: '#2E5E4E', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  backText: { color: 'white', fontSize: 16, fontWeight: '600' },
});