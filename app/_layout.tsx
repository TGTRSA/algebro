import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="debug"/>
        <Stack.Screen name="algebra" />
        <Stack.Screen name="trig" />
        <Stack.Screen name="calc" />
      </Stack>
    </SafeAreaProvider>
  );
}