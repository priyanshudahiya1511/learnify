import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { authService } from '../services/authService';
import { useTheme } from '../hooks/useTheme';

export default function Index() {
  const { colors } = useTheme();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const loggedIn = await authService.isLoggedIn();
    if (loggedIn) {
      router.replace('/(tabs)/courses');
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
