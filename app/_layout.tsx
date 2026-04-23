import { Stack } from 'expo-router';
import '../global.css';
import { useColorScheme, AppState } from 'react-native'; // ← add AppState here
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    setupNotifications();

    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'background') {
        await notificationService.schedule24hrReminder();
      } else if (state === 'active') {
        await notificationService.cancelAll();
        await notificationService.schedule24hrReminder();
      }
    });

    return () => subscription.remove();
  }, []);

  const setupNotifications = async () => {
    const granted = await notificationService.requestPermissions();
    if (granted) {
      await notificationService.schedule24hrReminder();
    }
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
