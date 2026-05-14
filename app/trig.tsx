import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = {
  background: '#FDF5E6',
  backgroundGradient: '#F5E6D3',
  title: '#2E5E4E',
  text: '#4A4A4A',
  backText: '#2E5E4E',
  backHover: '#1E3E32',
};

export default function Trig() {
  return (
    <LinearGradient colors={[colors.background, colors.backgroundGradient]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Trigonometry</Text>
            <Text style={styles.content}>Welcome to Trigonometry!</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { 
    flex: 1, 
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 40,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: { 
    color: colors.backText, 
    fontSize: 17, 
    fontWeight: '500',
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60, // Offset the header to center content properly
  },
  title: { 
    fontSize: 42, 
    fontWeight: '300', 
    color: colors.title, 
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  content: { 
    fontSize: 18, 
    color: colors.text, 
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.8,
  },
});