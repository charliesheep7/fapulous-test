/* eslint-disable react/no-unstable-nested-components */
import { useIsFocused } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Home as HomeIcon, User as UserIcon } from '@/components/ui/icons';

// Animated Home Icon Component
function AnimatedHomeIcon({
  color,
  routeName,
}: {
  color: string;
  routeName: string;
}) {
  const scale = useSharedValue(1);
  const isFocused = useIsFocused();
  const prevFocused = useRef(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    // Only animate when this specific route becomes focused (pressed)
    if (isFocused && !prevFocused.current && routeName === 'index') {
      // Cancel any existing animation
      cancelAnimation(scale);

      // Start zoom out animation
      scale.value = withSequence(
        withTiming(0.7, { duration: 100 }),
        withSpring(1, { damping: 12, stiffness: 200 })
      );
    }

    prevFocused.current = isFocused;
  }, [isFocused, routeName, scale]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      cancelAnimation(scale);
    };
  }, [scale]);

  return (
    <Animated.View style={animatedStyle}>
      <HomeIcon color={color} />
    </Animated.View>
  );
}

// Animated User Icon Component with Jelly Wiggle
function AnimatedUserIcon({
  color,
  routeName,
}: {
  color: string;
  routeName: string;
}) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const isFocused = useIsFocused();
  const prevFocused = useRef(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    // Only animate when this specific route becomes focused (pressed)
    if (isFocused && !prevFocused.current && routeName === 'user') {
      // Cancel any existing animations
      cancelAnimation(scale);
      cancelAnimation(rotation);

      // Jelly Wiggle: Scale up + rotation wiggle (like saying "hello!")
      scale.value = withSpring(1.15, { damping: 6, stiffness: 150 });
      rotation.value = withSequence(
        withTiming(5, { duration: 100 }),
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );

      // Return scale to normal after wiggle
      setTimeout(() => {
        scale.value = withSpring(1, { damping: 8, stiffness: 200 });
      }, 300);
    }

    prevFocused.current = isFocused;
  }, [isFocused, routeName, scale, rotation]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      cancelAnimation(scale);
      cancelAnimation(rotation);
    };
  }, [scale, rotation]);

  return (
    <Animated.View style={animatedStyle}>
      <UserIcon color={color} />
    </Animated.View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Fapulous',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AnimatedHomeIcon color={color} routeName="index" />
          ),
          tabBarButtonTestID: 'fapulous-tab',
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'You',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AnimatedUserIcon color={color} routeName="user" />
          ),
          tabBarButtonTestID: 'user-tab',
        }}
      />
    </Tabs>
  );
}
