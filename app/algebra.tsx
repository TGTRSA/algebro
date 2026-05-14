import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = {
  primary: '#8B4513',
  primaryDark: '#6B3410',
  background: '#FDF5E6',
  backgroundGradient: '#F5E6D3',
  textLight: '#FFFFFF',
  textDark: '#4A3520',
  shadow: '#000000',
};

const topics = [
  { name: 'Basic Algebra', page: 'basic', icon: '𝑥', description: 'Learn the fundamentals' },
  { name: 'Quadratic Equations', page: 'quadratic', icon: '𝑥²', description: 'Master the parabola' },
  { name: 'Factoring', page: 'factoring', icon: '✕', description: 'Break it down' },
  { name: 'Exponents', page: 'exponents', icon: '⁴', description: 'Power up your math' },
];

export default function Algebra() {
  return (
    <LinearGradient colors={[colors.background, colors.backgroundGradient]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Algebra Topics</Text>
          <Text style={styles.subtitle}>Choose your path to mastery</Text>
          
          {topics.map((topic, index) => (
            <TouchableOpacity
              key={topic.page}
              style={styles.topicButton}
              onPress={() => router.push(`/algebra-pages/${topic.page}` as any)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.topicGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.topicIconContainer}>
                  <Text style={styles.topicIcon}>{topic.icon}</Text>
                </View>
                <View style={styles.topicContent}>
                  <Text style={styles.topicText}>{topic.name}</Text>
                  <Text style={styles.topicDescription}>{topic.description}</Text>
                </View>
                <Text style={styles.topicArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignSelf: 'flex-start',
  },
  backText: { 
    color: colors.primary, 
    fontSize: 17, 
    fontWeight: '500',
    opacity: 0.8,
  },
  container: { 
    paddingHorizontal: 20, 
    paddingBottom: 40,
  },
  title: { 
    fontSize: 48, 
    fontWeight: '300', 
    color: colors.primary, 
    marginBottom: 8, 
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  topicButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topicGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  topicIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topicIcon: {
    fontSize: 24,
    color: colors.textLight,
    fontWeight: '600',
  },
  topicContent: {
    flex: 1,
  },
  topicText: { 
    color: colors.textLight, 
    fontSize: 18, 
    fontWeight: '600',
    marginBottom: 4,
  },
  topicDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  topicArrow: {
    color: colors.textLight,
    fontSize: 20,
    opacity: 0.7,
    marginLeft: 8,
  },
});