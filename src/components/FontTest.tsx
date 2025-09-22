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
        Light (300) - Swift Finances
      </Text>
      
      <Text style={[styles.regular, { color: theme.colors.text }]}>
        Regular (400) - Swift Finances
      </Text>
      
      <Text style={[styles.medium, { color: theme.colors.text }]}>
        Medium (500) - Swift Finances
      </Text>
      
      <Text style={[styles.semibold, { color: theme.colors.text }]}>
        Semibold (600) - Swift Finances
      </Text>
      
      <Text style={[styles.bold, { color: theme.colors.text }]}>
        Bold (700) - Swift Finances
      </Text>
      
      <Text style={[styles.extrabold, { color: theme.colors.text }]}>
        Extrabold (800) - Swift Finances
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
    fontFamily: 'AlanSans-Variable',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  light: {
    fontSize: 18,
    fontFamily: 'AlanSans-Variable',
    fontWeight: '300',
  },
  regular: {
    fontSize: 18,
    fontFamily: 'AlanSans-Variable',
    fontWeight: '400',
  },
  medium: {
    fontSize: 18,
    fontFamily: 'AlanSans-Variable',
    fontWeight: '500',
  },
  semibold: {
    fontSize: 18,
    fontFamily: 'AlanSans-Variable',
    fontWeight: '600',
  },
  bold: {
    fontSize: 18,
    fontFamily: 'AlanSans-Variable',
    fontWeight: '700',
  },
  extrabold: {
    fontSize: 18,
    fontFamily: 'AlanSans-Variable',
    fontWeight: '800',
  },
});