import { useState, useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const isFirstRun = useRef(true);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      const connected =
        state.isConnected === true && state.isInternetReachable !== false;
      setIsConnected(connected);
      isFirstRun.current = false;
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (isFirstRun.current) return;
      const connected =
        state.isConnected === true && state.isInternetReachable !== false;
      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected };
};
