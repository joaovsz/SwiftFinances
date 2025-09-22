import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';

interface CustomDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  style?: any;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Selecione uma data',
  style,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { theme, isDark } = useTheme();

  return (
    <>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={[
          {
            padding: 20,
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            minHeight: 64,
            justifyContent: 'center',
            marginVertical: 8,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          style,
        ]}
      >
        <Text
          style={{
            fontFamily: 'AlanSans-Regular',
            color: theme.colors.text,
            fontSize: 16,
          }}
        >
          {value ? value.toLocaleDateString('pt-BR') : placeholder}
        </Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          locale="pt-BR"
          themeVariant={isDark ? 'dark' : 'light'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
        />
      )}
    </>
  );
};