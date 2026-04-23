import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { storage } from '../lib/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  requestPermissions: async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  showNotification: async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  },

  schedule24hrReminder: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Miss learning?',
        body: "You haven't opened the app in 24 hours. Continue your courses!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60 * 24,
        repeats: false,
      },
    });
  },

  cancelAll: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  checkBookmarkNotification: async () => {
    const bookmarks = await storage.getItem<string[]>('@bookmarks');
    const count = bookmarks?.length ?? 0;

    if (count === 5) {
      await notificationService.showNotification(
        '5 Courses Bookmarked!',
        "You've saved 5 courses. Time to start learning!"
      );
    }
  },
};
