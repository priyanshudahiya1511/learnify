import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  setItem: async (key: string, value: unknown): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  getItem: async <T>(key: string): Promise<T | null> => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  deleteItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },

  clear: async (): Promise<void> => {
    await AsyncStorage.clear();
  },
};
