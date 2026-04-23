import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },

  getItem: async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  },

  deleteItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },
};
