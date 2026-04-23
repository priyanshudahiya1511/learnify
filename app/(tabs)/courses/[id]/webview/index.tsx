import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../hooks/useTheme';
import { storage } from '../../../../../lib/storage';

const sanitize = (str: string) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getHtmlContent = (course: any) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title>Course Content</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #0F172A;
        color: #F9FAFB;
        padding: 20px;
        overflow-x: hidden;
      }
      #content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .badge {
        display: inline-block;
        background: rgba(99, 102, 241, 0.2);
        color: #6366F1;
        font-size: 12px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 999px;
      }
      .title { font-size: 22px; font-weight: 700; line-height: 1.4; }
      .meta { display: flex; gap: 16px; align-items: center; }
      .price { color: #6366F1; font-weight: 700; font-size: 18px; }
      .rating { color: #F59E0B; font-weight: 600; font-size: 15px; }
      .thumbnail {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 16px;
        display: block;
      }
      .section-title {
        font-size: 16px;
        font-weight: 700;
        color: #F9FAFB;
        margin-bottom: 8px;
      }
      .description { font-size: 14px; line-height: 1.8; color: #9CA3AF; }
      .instructor-card {
        display: flex;
        align-items: center;
        gap: 14px;
        background: #1E293B;
        border-radius: 16px;
        padding: 16px;
      }
      .instructor-card img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }
      .instructor-name { font-size: 15px; font-weight: 600; }
      .instructor-label { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
      .modules { background: #1E293B; border-radius: 16px; overflow: hidden; }
      .module-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border-bottom: 1px solid #334155;
      }
      .module-item:last-child { border-bottom: none; }
      .module-num {
        width: 28px;
        height: 28px;
        min-width: 28px;
        background: rgba(99,102,241,0.15);
        color: #6366F1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
      }
      .module-title { font-size: 14px; color: #F9FAFB; }
      .enroll-btn {
        width: 100%;
        padding: 16px;
        background: #6366F1;
        color: white;
        border: none;
        border-radius: 14px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        margin-bottom: 32px;
      }
      .enroll-btn.enrolled { background: #22C55E; }
    </style>
  </head>
  <body>
    <div id="content">
      <div class="badge">${course.category}</div>
      <h1 class="title">${course.title}</h1>
      <div class="meta">
        <span class="rating">⭐ ${course.rating}</span>
        <span class="price">$${course.price}</span>
      </div>
      <img class="thumbnail" src="${course.thumbnail}" />
      <div>
        <p class="section-title">About this course</p>
        <p class="description">${course.description}</p>
      </div>
      <div>
        <p class="section-title">Your Instructor</p>
        <div class="instructor-card">
          <img src="${course.instructor.picture}" />
          <div>
            <div class="instructor-name">${course.instructor.name}</div>
            <div class="instructor-label">Course Instructor</div>
          </div>
        </div>
      </div>
      <div>
        <p class="section-title">Course Modules</p>
        <div class="modules">
          <div class="module-item"><div class="module-num">1</div><div class="module-title">Introduction &amp; Overview</div></div>
          <div class="module-item"><div class="module-num">2</div><div class="module-title">Core Concepts &amp; Fundamentals</div></div>
          <div class="module-item"><div class="module-num">3</div><div class="module-title">Hands-on Practice</div></div>
          <div class="module-item"><div class="module-num">4</div><div class="module-title">Advanced Topics</div></div>
          <div class="module-item"><div class="module-num">5</div><div class="module-title">Real World Projects</div></div>
          <div class="module-item"><div class="module-num">6</div><div class="module-title">Assessment &amp; Certification</div></div>
        </div>
      </div>
      <button
        class="enroll-btn ${course.isEnrolled ? 'enrolled' : ''}"
        onclick="notifyNative('enroll')"
        ${course.isEnrolled ? 'disabled' : ''}>
        ${course.isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
      </button>
    </div>
    <script>
      function notifyNative(action) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ action: action }));
        }
      }
    </script>
  </body>
</html>
`;

export default function CourseWebViewScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const webViewRef = useRef<WebView>(null);
  const [loadError, setLoadError] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(params.isEnrolled === 'true');

  const course = {
    title: params.title as string,
    description: params.description as string,
    price: params.price as string,
    thumbnail: params.thumbnail as string,
    rating: params.rating as string,
    category: params.category as string,
    isEnrolled,
    instructor: {
      name: params.instructorName as string,
      picture: `https://picsum.photos/seed/${params.instructorName}/100/100`,
    },
  };

  console.log('WebView params:', {
    title: params.title,
    category: params.category,
    description: params.description,
  });

  const safeCourse = {
    title: sanitize(course.title),
    description: sanitize(course.description),
    price: sanitize(course.price),
    thumbnail: course.thumbnail,
    rating: sanitize(course.rating),
    category: sanitize(course.category),
    isEnrolled: course.isEnrolled,
    instructor: {
      name: sanitize(course.instructor.name),
      picture: course.instructor.picture,
    },
  };

  const handleMessage = async (event: any) => {
    try {
      const { action } = JSON.parse(event.nativeEvent.data);
      if (action === 'enroll') {
        const enrolled = (await storage.getItem<string[]>('@enrolled')) || [];
        const id = params.id as string;
        if (!enrolled.includes(id)) {
          await storage.setItem('@enrolled', [...enrolled, id]);
        }
        setIsEnrolled(true);
        Alert.alert(
          '🎉 Enrolled!',
          'You have successfully enrolled in this course.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (e) {
      console.error('WebView message error', e);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}>
      <View
        className="flex-row items-center px-4 py-3 gap-3"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text
          className="text-base font-semibold flex-1"
          numberOfLines={1}
          style={{ color: colors.text }}>
          {course.title}
        </Text>
      </View>

      {loadError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="wifi-outline" size={48} color={colors.textMuted} />
          <Text
            className="text-base text-center mt-4"
            style={{ color: colors.textSecondary }}>
            Failed to load course content.
          </Text>
          <TouchableOpacity
            className="mt-4 px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.primary }}
            onPress={() => {
              setLoadError(false);
              webViewRef.current?.reload();
            }}>
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ html: getHtmlContent(safeCourse) }}
          onMessage={handleMessage}
          onError={() => setLoadError(true)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState
          renderLoading={() => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          style={{ flex: 1 }}
        />
      )}
    </SafeAreaView>
  );
}
