import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { authService } from '../../services/authService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LoginScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await authService.login(email, password);
      router.replace('/(tabs)/courses');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View
          className="flex-1 px-6 justify-center"
          style={{ backgroundColor: colors.background }}>
          <Text
            className="text-4xl font-bold mb-2"
            style={{ color: colors.text }}>
            Welcome back 👋
          </Text>
          <Text
            className="text-base mb-8"
            style={{ color: colors.textSecondary }}>
            Login to continue learning
          </Text>

          {error ? (
            <View className="bg-red-100 px-4 py-3 rounded-xl mb-4">
              <Text className="text-red-500">{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <Text
            className="text-sm font-medium mb-1"
            style={{ color: colors.text }}>
            Email
          </Text>
          <TextInput
            className="px-4 py-3 rounded-xl mb-4 "
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            placeholder="Enter your email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text
            className="text-sm font-medium mb-1"
            style={{ color: colors.text }}>
            Password
          </Text>
          <TextInput
            className="px-4 py-3 rounded-xl mb-6"
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            placeholder="Enter your password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            className="py-4 rounded-xl items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Login</Text>
            )}
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text style={{ color: colors.textSecondary }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="font-bold" style={{ color: colors.primary }}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
