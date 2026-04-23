import { Animated, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OfflineBannerProps {
  isConnected: boolean;
}

export const OfflineBanner = ({ isConnected }: OfflineBannerProps) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const [visible, setVisible] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setShowReconnected(false);
      setVisible(true);
      setWasOffline(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else if (wasOffline) {
      setShowReconnected(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
          setShowReconnected(false);
          setWasOffline(false);
        });
      }, 2000);
    }
  }, [isConnected]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: 'absolute',
        top: insets.top,
        left: 12,
        right: 12,
        zIndex: 9999,
        borderRadius: 12,
        overflow: 'hidden',
      }}>
      <View
        style={{
          backgroundColor: showReconnected ? '#16a34a' : '#dc2626',
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 5,
        }}>
        <Ionicons
          name={showReconnected ? 'wifi' : 'wifi-outline'}
          size={18}
          color="white"
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>
            {showReconnected ? 'Back online' : 'No internet connection'}
          </Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 11,
              marginTop: 1,
            }}>
            {showReconnected
              ? 'Your connection has been restored'
              : 'Check your WiFi or mobile data'}
          </Text>
        </View>
        {!showReconnected && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#fca5a5',
            }}
          />
        )}
      </View>
    </Animated.View>
  );
};
