import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome1" />
      <Stack.Screen name="welcome2" />
      <Stack.Screen name="welcome3" />
    </Stack>
  );
}