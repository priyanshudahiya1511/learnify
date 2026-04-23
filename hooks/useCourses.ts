import { useCallback, useEffect, useState } from 'react';
import { courseService } from '../services/courseService';
import { storage } from '../lib/storage';
import { notificationService } from '../services/notificationService';

export const useCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    fetchCourses();
    loadBookmarks();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const [productData, usersData] = await Promise.all([
        courseService.getCourses(),
        courseService.getInstructors(),
      ]);

      const combinedData = productData.data.map(
        (product: any, index: number) => {
          const instructor = usersData.data[index % usersData.data.length];
          return {
            id: product.id.toString(),
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: `https://picsum.photos/seed/${product.id}/400/220`,
            rating: product.rating,
            category: product.category,
            instructor: {
              name: instructor
                ? `${instructor.name?.first} ${instructor.name?.last}`
                : 'Unknown Instructor',
              picture:
                instructor?.picture?.medium ??
                `https://picsum.photos/seed/${index}/100/100`,
            },
          };
        }
      );
      setCourses(combinedData);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch courses.');
    } finally {
      setLoading(false);
    }
  };

  const refreshCourses = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, []);

  const toggleBookmark = async (courseId: string) => {
    setBookmarks((prev) => {
      const newBookmarks = prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];

      // Save to storage
      storage.setItem('@bookmarks', newBookmarks);
      notificationService.checkBookmarkNotification();

      return newBookmarks;
    });
  };

  const loadBookmarks = async () => {
    const saved = await storage.getItem<string[]>('@bookmarks');
    if (saved) {
      setBookmarks(saved.map((id) => id.toString()));
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase())
  );

  return {
    courses: filteredCourses,
    loading,
    refreshing,
    error,
    search,
    setSearch,
    bookmarks,
    toggleBookmark,
    refreshCourses,
  };
};
