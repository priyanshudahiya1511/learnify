import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { OfflineBanner } from '../../components/OfflineBanner';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export default function TabsLayout() {
  const { colors } = useTheme();
  const { isConnected } = useNetworkStatus();

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner isConnected={isConnected} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        }}>
        <Tabs.Screen
          name="courses"
          options={{
            title: 'Courses',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
