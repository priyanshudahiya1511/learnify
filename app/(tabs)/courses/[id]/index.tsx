import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../hooks/useTheme';
import { courseService } from '../../../../services/courseService';
import { storage } from '../../../../lib/storage';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetail();
    checkBookmark();
    checkEnrolled();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await courseService.getCourseById(id);
      setCourse({
        ...data,
        thumbnail: `https://picsum.photos/seed/${id}/400/220`, // ← override
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  const checkBookmark = async () => {
    const bookmarks = await storage.getItem<string[]>('@bookmarks');
    if (bookmarks) setIsBookmarked(bookmarks.includes(id));
  };

  const toggleBookmark = async () => {
    const bookmarks = (await storage.getItem<string[]>('@bookmarks')) || [];
    const updated = isBookmarked
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    await storage.setItem('@bookmarks', updated);
    setIsBookmarked(!isBookmarked);
  };

  const checkEnrolled = async () => {
    const enrolled = await storage.getItem<string[]>('@enrolled');
    if (enrolled) setIsEnrolled(enrolled.includes(id));
  };

  const handleEnroll = async () => {
    const enrolled = (await storage.getItem<string[]>('@enrolled')) || [];
    if (!enrolled.includes(id)) {
      await storage.setItem('@enrolled', [...enrolled, id]);
    }
    setIsEnrolled(true);
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

  if (error) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.background }}>
        <Text style={{ color: colors.error }} className="text-base text-center">
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchCourseDetail}
          className="mt-4 px-6 py-3 rounded-xl"
          style={{ backgroundColor: colors.primary }}>
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleBookmark}>
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isBookmarked ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: course?.thumbnail }}
          style={{ width: '100%', height: 224 }}
          resizeMode="cover"
        />

        <View className="p-6">
          <View
            className="self-start px-3 py-1 rounded-full mb-3"
            style={{ backgroundColor: colors.primary + '20' }}>
            <Text
              className="text-xs font-medium"
              style={{ color: colors.primary }}>
              {course?.category ?? 'Development'}
            </Text>
          </View>

          <Text
            className="text-2xl font-bold mb-2"
            style={{ color: colors.text }}>
            {course?.title ?? 'Untitled Course'}
          </Text>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="font-semibold" style={{ color: colors.text }}>
                {course?.rating ?? '4.5'}
              </Text>
            </View>
            <Text
              className="text-xl font-bold"
              style={{ color: colors.primary }}>
              ${course?.price ?? '0'}
            </Text>
          </View>

          <Text
            className="text-sm leading-6 mb-6"
            style={{ color: colors.textSecondary }}>
            {course?.description ?? 'No description available.'}
          </Text>

          <TouchableOpacity
            className="py-4 rounded-xl items-center mb-3"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/courses/[id]/webview' as any,
                params: {
                  id,
                  title: course?.title,
                  description: course?.description,
                  price: course?.price,
                  thumbnail: course?.thumbnail,
                  rating: course?.rating,
                  category: course?.category,
                  isEnrolled: String(isEnrolled),
                  instructorName: course?.instructor?.name ?? '',
                  instructorPicture: course?.instructor?.picture ?? '',
                },
              })
            }>
            <Text
              className="font-bold text-base"
              style={{ color: colors.text }}>
              View Content
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 rounded-xl items-center"
            style={{
              backgroundColor: isEnrolled ? colors.success : colors.primary,
            }}
            onPress={handleEnroll}
            disabled={isEnrolled}>
            <Text className="text-white font-bold text-base">
              {isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
