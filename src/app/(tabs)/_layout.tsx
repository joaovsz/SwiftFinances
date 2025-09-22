import { useFinances } from "@/src/context/FinancesContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import {
  AdjustmentsHorizontalIcon,
  Cog8ToothIcon,
  HomeIcon,
  PlusIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import tw from "twrnc";
import Preferences from "./Preferences";
import Settings from "./Settings";
import { Pressable } from "react-native";
import Home from ".";
import { ThemeContextProvider } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/context/AuthContext";
import { router } from "expo-router";
import { ProfileModalProvider, useProfileModal } from "@/src/context/ProfileModalContext";
import { ProfileModal } from "@/src/components/ProfileModal";

const Tab = createBottomTabNavigator();
export const EmptyScreen = () => <></>;

// Profile Button Component
const ProfileButton = ({ color, size }: { color: string; size: number }) => {
  const { showProfileModal } = useProfileModal();
  
  return (
    <Pressable onPress={showProfileModal}>
      <UserIcon color={color} size={size} />
    </Pressable>
  );
};

export default function TabLayout() {
  const { setOpenAddTransactionModal } = useFinances();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/Login");
    }
  }, [loading, isAuthenticated]);
  return (
    <ProfileModalProvider>
      <ThemeContextProvider>
        <Tab.Navigator
          screenOptions={() => ({
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#3b82f6",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: tw`absolute bottom-6 rounded-xl left-5 right-5 bg-[#1D1C21] border-t-0`,
            headerStyle: {
              backgroundColor: "#1D1C21",
              elevation: 0,
            },
            headerTintColor: "#fff",
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
                  onPress={() => setOpenAddTransactionModal(true)}
                  className={`rounded-full bg-[#3b82f6] items-center justify-center -top-8 h-[65px] w-[65px] p-0 `}
                >
                  <PlusIcon color={"#fff"} size={35} />
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
              tabBarIcon: ({ focused, color, size }) => (
                <ProfileButton color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
        <ProfileModal />
      </ThemeContextProvider>
    </ProfileModalProvider>
  );
}
