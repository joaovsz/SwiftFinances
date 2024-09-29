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
import Profile from "./Profile";
import Settings from "./Settings";
import { Pressable, TouchableHighlight } from "react-native";
import Home from ".";
import { ThemeContextProvider } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/context/AuthContext";
import { router } from "expo-router";

const Tab = createBottomTabNavigator();
export const EmptyScreen = () => <></>;

export default function TabLayout() {
  const { setOpenAddTransactionModal } = useFinances();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/Login");
    }
  }, [loading, isAuthenticated]);
  return (
    <ThemeContextProvider>
      <Tab.Navigator
        screenOptions={() => ({
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#80AF81",
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
                className={`rounded-full bg-[#80AF81] items-center justify-center -top-8 h-[65px] w-[65px] p-0 `}
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
            headerShown: true,
            tabBarIcon: ({ focused, color, size }) => (
              <Cog8ToothIcon color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Meu Perfil"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <UserIcon color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </ThemeContextProvider>
  );
}
