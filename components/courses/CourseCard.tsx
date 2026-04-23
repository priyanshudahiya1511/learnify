import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    rating: number;
    category: string;
    instructor: {
      name: string;
      picture: string;
    };
  };
  isBookmarked: boolean;
  onBookmark: (id: string) => void;
  onPress: (id: string) => void;
}

const CourseCard = ({
  course,
  isBookmarked,
  onBookmark,
  onPress,
}: CourseCardProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="mb-4 rounded-2xl"
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        overflow: 'hidden',
      }}
      onPress={() => onPress(course.id)}
      activeOpacity={0.8}>
      <Image
        source={{ uri: course.thumbnail }}
        style={{ width: '100%', height: 192 }}
        resizeMode="cover"
      />

      <View className="p-4">
        <View
          className="self-start px-3 py-1 rounded-full mb-2"
          style={{ backgroundColor: colors.primary + '20' }}>
          <Text
            className="text-xs font-medium"
            style={{ color: colors.primary }}>
            {course.category}
          </Text>
        </View>

        <Text
          className="text-base font-bold mb-1"
          numberOfLines={2}
          style={{ color: colors.text }}>
          {course.title}
        </Text>

        <Text
          className="text-sm mb-3"
          numberOfLines={2}
          style={{ color: colors.textSecondary }}>
          {course.description}
        </Text>

        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: course.instructor.picture }}
            style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
            resizeMode="cover"
          />
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {course.instructor.name}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text
              className="text-sm font-medium"
              style={{ color: colors.text }}>
              {course.rating}
            </Text>
          </View>

          <Text
            className="text-base font-bold"
            style={{ color: colors.primary }}>
            ${course.price}
          </Text>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onBookmark(course.id);
            }}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isBookmarked ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;
