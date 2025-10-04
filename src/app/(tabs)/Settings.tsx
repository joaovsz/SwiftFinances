import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "@/src/context/ThemeContext";
import { Button, Switch, Modal, Portal } from "react-native-paper";
import { MoonIcon, SunIcon, BellIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { NotificationSettingsScreen } from "@/src/components/NotificationSettingsScreen";
import { NotificationTestScreen } from "@/src/components/NotificationTestScreenSimple";
export default function Settings() {
  const { isDark, toggleTheme, theme } = useTheme();
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showNotificationTest, setShowNotificationTest] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text 
          style={[
            styles.title,
            { color: theme.colors.text, fontFamily: 'AlanSans-Bold' }
          ]}
        >
          Configurações
        </Text>

        {/* Theme Setting */}
        <View style={[styles.settingCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              {isDark ? (
                <MoonIcon size={24} color={theme.colors.primary} />
              ) : (
                <SunIcon size={24} color={theme.colors.primary} />
              )}
              <Text style={[styles.settingTitle, { color: theme.colors.text, fontFamily: 'AlanSans-SemiBold' }]}>
                {isDark ? 'Tema Escuro' : 'Tema Claro'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={isDark ? theme.colors.primary : theme.colors.secondary}
            />
          </View>
        </View>

        {/* Notification Settings */}
        <TouchableOpacity
          style={[styles.settingCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => setShowNotificationSettings(true)}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <BellIcon size={24} color={theme.colors.primary} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text, fontFamily: 'AlanSans-SemiBold' }]}>
                  Notificações Bancárias
                </Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.secondary, fontFamily: 'AlanSans-Regular' }]}>
                  Criação automática de transações
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={20} color={theme.colors.secondary} />
          </View>
        </TouchableOpacity>

        {/* Test Notifications */}
        <TouchableOpacity
          style={[styles.settingCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => setShowNotificationTest(true)}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>🧪</Text>
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text, fontFamily: 'AlanSans-SemiBold' }]}>
                  Testar Notificações
                </Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.secondary, fontFamily: 'AlanSans-Regular' }]}>
                  Simular mensagens bancárias
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={20} color={theme.colors.secondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Notification Settings Modal */}
      <Portal>
        <Modal
          visible={showNotificationSettings}
          onDismiss={() => setShowNotificationSettings(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <NotificationSettingsScreen />
        </Modal>
      </Portal>

      {/* Notification Test Modal */}
      <Portal>
        <Modal
          visible={showNotificationTest}
          onDismiss={() => setShowNotificationTest(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <NotificationTestScreen />
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {  
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 32,
  },
  settingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 16,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 16,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    margin: 0,
  },
});
