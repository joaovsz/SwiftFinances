import { useFinances } from "@/src/context/FinancesContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  Cog8ToothIcon,
  HomeIcon,
  PlusIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import Preferences from "./Preferences";
import Settings from "./Settings";
import { Pressable } from "react-native";
import Home from ".";
import { ThemeContextProvider, useTheme } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/context/AuthContext";
import { router } from "expo-router";
import { ProfileModalProvider, useProfileModal } from "@/src/context/ProfileModalContext";
import { ProfileModal } from "@/src/components/ProfileModal";
import { EditTransactionModal } from "@/src/components/EditTransactionModal";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();
export const EmptyScreen = () => <></>;


const ThemedTabNavigator = () => {
  const { setOpenAddTransactionModal } = useFinances();
  const { theme, isDark } = useTheme();
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
          backgroundColor: theme.colors.tabBar,
          borderRadius: 32,
          height: 68,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          paddingHorizontal: 8
        },
        headerStyle: {
          backgroundColor: theme.colors.headerBg,
          elevation: 0,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen
        name="index"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Preferências"
        component={Preferences}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <AdjustmentsHorizontalIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AddTransaction"
        component={EmptyScreen}
        options={{
          headerShown: false,
          tabBarButton: () => (
            <Pressable
              onPress={() => setShowNewTransactionModal(true)}
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                top: -20,
                height: 64,
                width: 64,
                elevation: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
              }}
            >
              <PlusIcon color="#ffffff" size={32} />
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="Confirgurações"
        component={Settings}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Cog8ToothIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Meu Perfil"
        component={EmptyScreen}
        options={{
          headerShown: false,
          tabBarButton: () => {
            const { showProfileModal } = useProfileModal();
            const { theme } = useTheme();
            
            return (
              <Pressable
                onPress={showProfileModal}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  minHeight: 48
                }}
              >
                <UserIcon color={theme.colors.secondary} size={24} />
              </Pressable>
            );
          },
        }}
      />
    </Tab.Navigator>
    
      <EditTransactionModal
        visible={showNewTransactionModal}
        onClose={() => setShowNewTransactionModal(false)}
        isNewTransaction={true}
      />
    </GestureHandlerRootView>
  );
};

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/Login");
    }
  }, [loading, isAuthenticated]);
  
  return (
    <ProfileModalProvider>
      <ThemeContextProvider>
        <ThemedTabNavigator />
        <ProfileModal />
      </ThemeContextProvider>
    </ProfileModalProvider>
  );
}
