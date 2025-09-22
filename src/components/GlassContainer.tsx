import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'light' | 'medium' | 'strong';
  blur?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  style,
  intensity = 'medium',
  blur = true,
}) => {
  const { theme, isDark } = useTheme();

  const getGlassStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      overflow: 'hidden',
    };

    if (isDark) {
      switch (intensity) {
        case 'light':
          return {
            ...baseStyle,
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            borderColor: 'rgba(34, 197, 94, 0.2)',
          };
        case 'medium':
          return {
            ...baseStyle,
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
          };
        case 'strong':
          return {
            ...baseStyle,
            backgroundColor: 'rgba(16, 185, 129, 0.18)',
            borderColor: 'rgba(34, 197, 94, 0.4)',
          };
      }
    } else {
      switch (intensity) {
        case 'light':
          return {
            ...baseStyle,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(34, 197, 94, 0.15)',
          };
        case 'medium':
          return {
            ...baseStyle,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(34, 197, 94, 0.2)',
          };
        case 'strong':
          return {
            ...baseStyle,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(34, 197, 94, 0.25)',
          };
      }
    }
  };

  return (
    <View style={[getGlassStyle(), style]}>
      {children}
    </View>
  );
};