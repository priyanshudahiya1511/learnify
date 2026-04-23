import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useCallback } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { useCourses } from '../../../hooks/useCourses';
import CourseCard from '../../../components/courses/CourseCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list';

export default function CoursesScreen() {
  const { colors } = useTheme();
  const {
    courses,
    loading,
    refreshing,
    error,
    search,
    setSearch,
    bookmarks,
    toggleBookmark,
    refreshCourses,
  } = useCourses();

  const handlePress = useCallback((id: string) => {
    router.push(`/(tabs)/courses/${id}` as any);
  }, []);

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
        <Text className="text-base text-center" style={{ color: colors.error }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}>
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          Explore Courses
        </Text>
        <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          Find your next learning adventure
        </Text>
      </View>

      <View
        className="mx-6 mb-4 px-4 py-3 rounded-xl flex-row items-center gap-2"
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          className="flex-1"
          style={{ color: colors.text, fontSize: 15 }}
          placeholder="Search courses..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <LegendList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        extraData={bookmarks}
        estimatedItemSize={300}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            isBookmarked={bookmarks.includes(item.id.toString())}
            onBookmark={toggleBookmark}
            onPress={handlePress}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshCourses}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text style={{ color: colors.textSecondary }}>
              No courses found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
