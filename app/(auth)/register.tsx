import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { router } from 'expo-router';
import { authService } from '../../services/authService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterScreen = () => {
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill all the fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await authService.register(username, email, password);
      router.replace('/(auth)/login');
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
      );
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
        <Text
          className="text-4xl font-bold mb-2"
          style={{ color: colors.text }}>
          Get Started
        </Text>
        <Text
          className="text-base mb-8"
          style={{ color: colors.textSecondary }}>
          Create your account to start learning
        </Text>

        {error ? (
          <View className="bg-red-100 px-4 py-3 rounded-xl mb-4">
            <Text className="text-red-500">{error}</Text>
          </View>
        ) : null}

        <Text
          className="text-sm font-medium mb-1"
          style={{ color: colors.text }}>
          Username
        </Text>
        <TextInput
          className="px-4 py-3 rounded-xl mb-4"
          style={{
            backgroundColor: colors.surface,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          placeholder="Enter your username"
          placeholderTextColor={colors.textMuted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

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
          className="px-4 py-3 rounded-xl mb-4"
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

        <Text
          className="text-sm font-medium mb-1"
          style={{ color: colors.text }}>
          Confirm Password
        </Text>
        <TextInput
          className="px-4 py-3 rounded-xl mb-6"
          style={{
            backgroundColor: colors.surface,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          placeholder="Confirm your password"
          placeholderTextColor={colors.textMuted}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable
          className="py-4 rounded-xl items-center"
          style={{ backgroundColor: colors.primary }}
          onPress={handleRegister}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Create Account
            </Text>
          )}
        </Pressable>

        <View className="flex-row justify-center mt-6">
          <Text style={{ color: colors.textSecondary }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="font-bold" style={{ color: colors.primary }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
