import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { Text, View } from '@/components/ui';

export function TypingIndicator() {
  const opacity1 = useRef(new Animated.Value(0.3)).current;
  const opacity2 = useRef(new Animated.Value(0.3)).current;
  const opacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      const duration = 600;
      const sequence = Animated.sequence([
        Animated.timing(opacity1, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity3, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity1, {
          toValue: 0.3,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 0.3,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity3, {
          toValue: 0.3,
          duration,
          useNativeDriver: true,
        }),
      ]);

      Animated.loop(sequence).start();
    };

    animate();
  }, [opacity1, opacity2, opacity3]);

  return (
    <View className="mb-3 flex-row justify-start">
      <View className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-700">
        <View className="flex-row items-center space-x-1">
          <Animated.View style={{ opacity: opacity1 }}>
            <Text className="text-lg text-gray-600 dark:text-gray-300">•</Text>
          </Animated.View>
          <Animated.View style={{ opacity: opacity2 }}>
            <Text className="text-lg text-gray-600 dark:text-gray-300">•</Text>
          </Animated.View>
          <Animated.View style={{ opacity: opacity3 }}>
            <Text className="text-lg text-gray-600 dark:text-gray-300">•</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
