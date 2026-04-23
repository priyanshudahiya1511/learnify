import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { authService } from '../../services/authService';
import { storage } from '../../lib/storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
      loadStats();
      loadLocalAvatar();
    }, [])
  );

  const fetchUser = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const bookmarks = await storage.getItem<string[]>('@bookmarks');
    const enrolled = await storage.getItem<string[]>('@enrolled');
    setBookmarkCount(bookmarks?.length ?? 0);
    setEnrolledCount(enrolled?.length ?? 0);
  };

  const loadLocalAvatar = async () => {
    const uri = await storage.getItem<string>('avatar_uri');
    if (uri) setLocalAvatar(uri);
  };

  const handleUpdateAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photo library to update your profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await storage.setItem('avatar_uri', uri);
      setLocalAvatar(uri);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            My Profile
          </Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View className="items-center py-8">
          <View style={{ position: 'relative' }}>
            {localAvatar || user?.avatar?.url ? (
              <Image
                source={{ uri: localAvatar || user?.avatar?.url }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: colors.primary,
                }}
              />
            ) : (
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: colors.primary + '30',
                  borderWidth: 3,
                  borderColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 36,
                    fontWeight: 'bold',
                    color: colors.primary,
                  }}>
                  {user?.username?.charAt(0).toUpperCase() ?? '?'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleUpdateAvatar}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: colors.primary,
                borderRadius: 999,
                padding: 6,
                borderWidth: 2,
                borderColor: colors.background,
              }}>
              <Ionicons name="camera-outline" size={14} color="white" />
            </TouchableOpacity>
          </View>

          <Text
            className="text-xl font-bold mt-4"
            style={{ color: colors.text }}>
            {user?.username ?? 'User'}
          </Text>
          <Text
            className="text-sm mt-1"
            style={{ color: colors.textSecondary }}>
            {user?.email ?? ''}
          </Text>

          <View
            className="px-4 py-1 rounded-full mt-3"
            style={{ backgroundColor: colors.primary + '20' }}>
            <Text
              className="text-xs font-semibold"
              style={{ color: colors.primary }}>
              {user?.role ?? 'USER'}
            </Text>
          </View>
        </View>

        <View className="flex-row mx-6 mb-6" style={{ gap: 12 }}>
          <View
            className="flex-1 items-center py-5 rounded-2xl"
            style={{ backgroundColor: colors.surface }}>
            <Text
              className="text-2xl font-bold"
              style={{ color: colors.primary }}>
              {enrolledCount}
            </Text>
            <Text
              className="text-xs mt-1"
              style={{ color: colors.textSecondary }}>
              Enrolled
            </Text>
          </View>

          <View
            className="flex-1 items-center py-5 rounded-2xl"
            style={{ backgroundColor: colors.surface }}>
            <Text
              className="text-2xl font-bold"
              style={{ color: colors.primary }}>
              {bookmarkCount}
            </Text>
            <Text
              className="text-xs mt-1"
              style={{ color: colors.textSecondary }}>
              Bookmarked
            </Text>
          </View>

          <View
            className="flex-1 items-center py-5 rounded-2xl"
            style={{ backgroundColor: colors.surface }}>
            <Text
              className="text-2xl font-bold"
              style={{
                color: user?.isEmailVerified ? colors.success : colors.error,
              }}>
              {user?.isEmailVerified ? '✓' : '✗'}
            </Text>
            <Text
              className="text-xs mt-1"
              style={{ color: colors.textSecondary }}>
              Verified
            </Text>
          </View>
        </View>

        <View
          className="mx-6 rounded-2xl mb-6"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
          <View
            className="flex-row items-center px-4 py-4"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}>
              <Ionicons
                name="person-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Username
              </Text>
              <Text
                className="text-sm font-medium mt-0.5"
                style={{ color: colors.text }}>
                {user?.username ?? '-'}
              </Text>
            </View>
          </View>

          <View
            className="flex-row items-center px-4 py-4"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Email
              </Text>
              <Text
                className="text-sm font-medium mt-0.5"
                style={{ color: colors.text }}>
                {user?.email ?? '-'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center px-4 py-4">
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Member Since
              </Text>
              <Text
                className="text-sm font-medium mt-0.5"
                style={{ color: colors.text }}>
                {user?.createdAt
                  ? new Date(user.createdAt).toDateString()
                  : '-'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="mx-6 py-4 rounded-2xl items-center mb-10"
          style={{
            backgroundColor: colors.error + '15',
            borderWidth: 1,
            borderColor: colors.error + '30',
          }}
          onPress={handleLogout}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
            <Text className="font-bold" style={{ color: colors.error }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
