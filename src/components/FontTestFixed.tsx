import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const FontTest: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Teste da Fonte Alan Sans
      </Text>
      
      <Text style={[styles.light, { color: theme.colors.text }]}>
        Light - Swift Finances
      </Text>
      
      <Text style={[styles.regular, { color: theme.colors.text }]}>
        Regular - Swift Finances
      </Text>
      
      <Text style={[styles.medium, { color: theme.colors.text }]}>
        Medium - Swift Finances
      </Text>
      
      <Text style={[styles.semibold, { color: theme.colors.text }]}>
        Semibold - Swift Finances
      </Text>
      
      <Text style={[styles.bold, { color: theme.colors.text }]}>
        Bold - Swift Finances
      </Text>
      
      <Text style={[styles.extrabold, { color: theme.colors.text }]}>
        Extrabold - Swift Finances
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: 'AlanSans-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  light: {
    fontSize: 18,
    fontFamily: 'AlanSans-Light',
  },
  regular: {
    fontSize: 18,
    fontFamily: 'AlanSans-Regular',
  },
  medium: {
    fontSize: 18,
    fontFamily: 'AlanSans-Medium',
  },
  semibold: {
    fontSize: 18,
    fontFamily: 'AlanSans-SemiBold',
  },
  bold: {
    fontSize: 18,
    fontFamily: 'AlanSans-Bold',
  },
  extrabold: {
    fontSize: 18,
    fontFamily: 'AlanSans-ExtraBold',
  },
});