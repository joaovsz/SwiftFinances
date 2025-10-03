import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface CategoryOption {
  value: string;
  label: string;
}

interface CustomCategorySelectorProps {
  options: CategoryOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
}

export const CustomCategorySelector: React.FC<CustomCategorySelectorProps> = ({
  options,
  selectedValue,
  onValueChange,
  style,
}) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[{ flexDirection: 'row', gap: 12 }, style]}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <Pressable
            key={option.value}
            style={{
              flex: 1,
              padding: 20,
              borderWidth: 2,
              borderColor: isSelected ? theme.colors.primary : '#e2e8f0',
              borderRadius: 12,
              backgroundColor: isSelected 
                ? theme.colors.primary + '20'  // 20% opacity
                : theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 64,
              marginVertical: 8,
            }}
            onPress={() => onValueChange(option.value)}
          >
            <Text
              style={{
                fontFamily: isSelected ? 'AlanSans-SemiBold' : 'AlanSans-Regular',
                color: isSelected ? theme.colors.primary : theme.colors.text,
                fontSize: 16,
                lineHeight: 22,
                paddingVertical: 2,
                textAlign: 'center',
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};