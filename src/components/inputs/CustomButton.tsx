import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: any;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  style,
}) => {
  const { theme, isDark } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: 12,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    };

    const sizeStyles = {
      small: { paddingVertical: 14, paddingHorizontal: 24 },
      medium: { paddingVertical: 18, paddingHorizontal: 32 },
      large: { paddingVertical: 22, paddingHorizontal: 40 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      },
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...sizeStyles[size],
        backgroundColor: isDark 
          ? 'rgba(128, 128, 128, 0.3)' 
          : 'rgba(128, 128, 128, 0.2)',
        borderWidth: 0,
      };
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontFamily: 'AlanSans-SemiBold', // 600 weight
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
    };

    if (disabled) {
      return {
        ...baseTextStyle,
        color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
      };
    }

    const variantTextStyles = {
      primary: { color: '#fff' },
      secondary: { color: theme.colors.text },
      outline: { color: theme.colors.primary },
    };

    return {
      ...baseTextStyle,
      ...variantTextStyles[variant],
    };
  };

  return (
    <Pressable
      style={[getButtonStyle(), style]}
      onPress={disabled ? undefined : onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon && icon}
        <Text style={getTextStyle()}>{title}</Text>
      </View>
    </Pressable>
  );
};