import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

type Subject = {
  name: string;
  route: '/algebra' | '/trig' | '/calc' | '/debug' | '/client';
  description: string;
  gradient: [string, string];
  icon: string;
};

export default function Homepage() {
  const subjects: Subject[] = [
    { 
      name: 'Debug', 
      route: '/debug',
      description: 'Debugging page',
      gradient: ['#4A3B52', '#7B5D6F'],
      icon: 'D'
    },
    { 
      name: 'Client', 
      route: '/client',
      description: 'Debugging page',
      gradient: ['#4A3B52', '#7B5D6F'],
      icon: 'D'
    },
    { 
      name: 'Algebra', 
      route: '/algebra',
      description: 'Equations & Variables',
      gradient: ['#8B4513', '#D2691E'],
      icon: 'x'
    },
    { 
      name: 'Trigonometry', 
      route: '/trig',
      description: 'Angles & Waves',
      gradient: ['#2E5E4E', '#5A8F6E'],
      icon: '𝜃'
    },
    { 
      name: 'Calculus', 
      route: '/calc',
      description: 'Change & Limits',
      gradient: ['#4A3B52', '#7B5D6F'],
      icon: '∫'
    },
    
  ];

  return (
    <LinearGradient
      colors={['#FDF5E6', '#F5E6D3'] as [string, string]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.decorativeLine} />
            <Text style={styles.title}>Math Journey</Text>
            <Text style={styles.subtitle}>Choose Your Path</Text>
            <View style={styles.decorativeLine} />
          </View>

          <Text style={styles.tagline}>
            Explore the beauty of mathematics
          </Text>

          <View style={styles.cardsContainer}>
            {subjects.map((subject, index) => (
              <TouchableOpacity
                key={index}
                style={styles.cardWrapper}
                onPress={() => router.push(subject.route)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={subject.gradient as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <View style={styles.cardIconContainer}>
                    <Text style={styles.cardIcon}>{subject.icon}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{subject.name}</Text>
                  <Text style={styles.cardDescription}>{subject.description}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardButton}>Learn →</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerDecoration}>
            <View style={styles.diamond} />
            <Text style={styles.footerText}>Harmony of Japanese aesthetics & mathematics</Text>
            <View style={styles.diamond} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  decorativeLine: {
    width: 60,
    height: 2,
    backgroundColor: '#8B4513',
    opacity: 0.4,
    marginVertical: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    color: '#4A3B52',
    letterSpacing: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7B6C',
    letterSpacing: 2,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 16,
    color: '#6B5B4F',
    textAlign: 'center',
    marginBottom: 48,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  cardsContainer: {
    gap: 24,
    marginBottom: 48,
  },
  cardWrapper: {
    borderRadius: 20,
    shadowColor: '#2E5E4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 32,
    color: 'white',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: 'white',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  cardFooter: {
    marginTop: 8,
  },
  cardButton: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
    opacity: 0.9,
  },
  footerDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  diamond: {
    width: 6,
    height: 6,
    backgroundColor: '#8B7B6C',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#9B8B7C',
    letterSpacing: 1,
  },
});