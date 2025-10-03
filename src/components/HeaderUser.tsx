import { View, Text, Image } from "react-native";
import React from "react";
import tw from "twrnc";
import { useAuth } from "../context/AuthContext";
import { UserIcon } from "react-native-heroicons/outline";
import { useTheme } from "../context/ThemeContext";

export default function HeaderUser() {
  const { userData, user } = useAuth();
  const { theme, isDark } = useTheme();
  
  return (
    <View
      style={{
        backgroundColor: isDark ? theme.colors.headerBg : theme.colors.headerBg,
        borderRadius: 32,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        elevation: isDark ? 4 : 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        minHeight: 72
      }}
    >
      {!user?.photoURL ? (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? theme.colors.surface : theme.colors.card,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UserIcon size={24} color={theme.colors.secondary} />
        </View>
      ) : (
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
          source={{ uri: user?.photoURL! }}
        />
      )}

      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Text 
          style={{ 
            color: theme.colors.text,
            fontFamily: 'AlanSans-SemiBold',
            fontSize: 18,
            lineHeight: 24,
            paddingVertical: 2
          }}
        >
          Olá, 
        </Text>
        <Text 
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ 
            color: theme.colors.text,
            fontFamily: 'AlanSans-SemiBold',
            fontSize: 18,
            lineHeight: 24,
            paddingVertical: 2,
            flex: 1
          }}
        >
          {userData?.name}
        </Text>
      </View>
    </View>
  );
}
