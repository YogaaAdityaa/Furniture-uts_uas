import { Tabs } from 'expo-router';
import React from 'react';
import { useEffect } from 'react';
import Airbridge from 'airbridge-react-native-sdk';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    if (Airbridge && (Airbridge as any).init) {
      (Airbridge as any).init("utsproject", "897eb656966146ec89bfc6ee738e617a897eb656966146ec89bfc6ee738e617a");
    } else {
      console.log("Airbridge is not available");
    }
  }, []);
  return (

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Cari',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
