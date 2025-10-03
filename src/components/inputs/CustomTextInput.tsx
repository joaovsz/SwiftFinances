import React from 'react';
import { TextInput as PaperTextInput, TextInputProps as PaperTextInputProps } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';

interface CustomTextInputProps extends Omit<PaperTextInputProps, 'theme'> {
  icon?: React.ReactNode;
  fontWeight?: '300' | '400' | '500' | '600' | '700' | '800';
}

export const CustomTextInput: React.FC<CustomTextInputProps> = ({ 
  icon, 
  fontWeight = '400',
  ...props 
}) => {
  const { theme, isDark } = useTheme();

  // Mapear fontWeight para o nome correto da fonte
  const getFontFamily = (weight: string) => {
    switch (weight) {
      case '300': return 'AlanSans-Light';
      case '400': return 'AlanSans-Regular';
      case '500': return 'AlanSans-Medium';
      case '600': return 'AlanSans-SemiBold';
      case '700': return 'AlanSans-Bold';
      case '800': return 'AlanSans-ExtraBold';
      case '900': return 'AlanSans-Black';
      default: return 'AlanSans-Regular';
    }
  };

  return (
    <PaperTextInput
      {...props}
      mode="outlined"
      left={icon ? <PaperTextInput.Icon icon={() => icon} /> : undefined}
      contentStyle={{
        fontFamily: getFontFamily(fontWeight),
        color: theme.colors.text,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        lineHeight: 22,
      }}
      style={[
        {
          backgroundColor: 'transparent',
          marginVertical: 8,
        },
        props.style
      ]}
      outlineStyle={{
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: isDark ? theme.colors.border : theme.colors.border,
      }}
      theme={{
        colors: {
          primary: theme.colors.primary,
          onSurface: theme.colors.text,
          onSurfaceVariant: isDark ? theme.colors.secondary : theme.colors.secondary,
          outline: isDark ? theme.colors.border : theme.colors.border,
          outlineVariant: isDark ? theme.colors.border : theme.colors.border,
          surface: 'transparent',
          background: 'transparent',
        }
      }}
    />
  );
};