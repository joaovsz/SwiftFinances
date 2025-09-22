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
      default: return 'AlanSans-Regular';
    }
  };

  return (
    <PaperTextInput
      {...props}
      left={icon ? <PaperTextInput.Icon icon={() => icon} /> : undefined}
      contentStyle={{
        fontFamily: getFontFamily(fontWeight),
        color: theme.colors.text,
        paddingHorizontal: 20,
        paddingVertical: 16,
      }}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: 12,
          marginVertical: 8,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        props.style
      ]}
      theme={{
        colors: {
          primary: theme.colors.primary,
          onSurface: theme.colors.text,
          onSurfaceVariant: theme.colors.text,
          outline: theme.colors.primary,
          surface: theme.colors.surface,
          background: theme.colors.background,
        }
      }}
    />
  );
};