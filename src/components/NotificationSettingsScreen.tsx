import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  BellIcon, 
  CogIcon, 
  BanknotesIcon,
  PlayIcon,
  StopIcon,
  InformationCircleIcon,
} from 'react-native-heroicons/outline';
import { useTheme } from '../context/ThemeContext';
import { NotificationService, NotificationServiceConfig } from '../services/NotificationService';
import { CustomButton } from './inputs/CustomButton';

export const NotificationSettingsScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const [config, setConfig] = useState<NotificationServiceConfig>({
    enabled: false,
    monitoredApps: [],
    autoCreateTransactions: true,
    notificationSound: false,
  });
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCurrentConfig();
  }, []);

  const loadCurrentConfig = async () => {
    const currentConfig = NotificationService.getConfig();
    setConfig(currentConfig);
    setIsServiceRunning(NotificationService.isEnabled());
  };

  const handleStartService = async () => {
    setIsLoading(true);
    try {
      await NotificationService.startMonitoring();
      setIsServiceRunning(true);
      Alert.alert(
        'Serviço Ativado! 🎉',
        'O monitoramento de notificações bancárias foi ativado. Agora as transações serão criadas automaticamente.',
        [{ text: 'Ok' }]
      );
    } catch (error) {
      Alert.alert(
        'Erro ao Ativar',
        'Não foi possível ativar o monitoramento. Verifique as permissões.',
        [{ text: 'Ok' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopService = async () => {
    setIsLoading(true);
    try {
      await NotificationService.stopMonitoring();
      setIsServiceRunning(false);
      Alert.alert(
        'Serviço Desativado',
        'O monitoramento foi interrompido.',
        [{ text: 'Ok' }]
      );
    } catch (error) {
      console.error('Erro ao parar serviço:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = async (key: keyof NotificationServiceConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    await NotificationService.updateConfig({ [key]: value });
  };

  const handleTestNotification = async () => {
    Alert.prompt(
      'Teste do Parser',
      'Digite uma mensagem de teste para verificar se seria reconhecida:',
      async (text) => {
        if (text) {
          const result = await NotificationService.testNotificationParser(
            'Teste',
            text,
            'com.nubank.app'
          );
          
          Alert.alert(
            'Resultado do Teste',
            result 
              ? `✅ Reconhecido!\nValor: R$ ${result.amount.toFixed(2)}\nDescrição: ${result.description}`
              : '❌ Não foi reconhecido como transação bancária',
            [{ text: 'Ok' }]
          );
        }
      }
    );
  };

  const showPermissionsHelp = () => {
    Alert.alert(
      'Como Ativar Permissões 📱',
      'Para o serviço funcionar, você precisa:\n\n' +
      '1. Permitir notificações do SwiftFinances\n' +
      '2. Dar acesso às notificações do sistema\n' +
      '3. Os bancos devem estar instalados\n\n' +
      'Bancos suportados:\n• Nubank\n• Itaú\n• Bradesco\n• Santander\n• PicPay\n• C6 Bank\n• Inter\n• BTG Pactual',
      [{ text: 'Entendi' }]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background }
      ]}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <BellIcon size={32} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text 
              style={[
                styles.headerTitle,
                { color: theme.colors.text, fontFamily: 'AlanSans-Bold' }
              ]}
            >
              Notificações Bancárias
            </Text>
            <Text 
              style={[
                styles.headerSubtitle,
                { color: theme.colors.secondary, fontFamily: 'AlanSans-Regular' }
              ]}
            >
              Crie transações automáticas
            </Text>
          </View>
        </View>

        {/* Status */}
        <View style={[styles.statusCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: isServiceRunning ? '#22c55e' : '#ef4444' }
            ]} />
            <Text 
              style={[
                styles.statusText,
                { color: theme.colors.text, fontFamily: 'AlanSans-SemiBold' }
              ]}
            >
              Status: {isServiceRunning ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
          
          {isServiceRunning ? (
            <CustomButton
              title="Parar Monitoramento"
              onPress={handleStopService}
              variant="outline"
              disabled={isLoading}
              icon={<StopIcon size={20} color={theme.colors.primary} />}
            />
          ) : (
            <CustomButton
              title="Iniciar Monitoramento"
              onPress={handleStartService}
              disabled={isLoading}
              icon={<PlayIcon size={20} color="white" />}
            />
          )}
        </View>

        {/* Configurações */}
        <View style={[styles.configCard, { backgroundColor: theme.colors.surface }]}>
          <Text 
            style={[
              styles.configTitle,
              { color: theme.colors.text, fontFamily: 'AlanSans-Bold' }
            ]}
          >
            Configurações
          </Text>

          {/* Auto Create Transactions */}
          <View style={styles.configItem}>
            <View style={styles.configItemText}>
              <Text 
                style={[
                  styles.configItemTitle,
                  { color: theme.colors.text, fontFamily: 'AlanSans-SemiBold' }
                ]}
              >
                Criar Transações Automaticamente
              </Text>
              <Text 
                style={[
                  styles.configItemSubtitle,
                  { color: theme.colors.secondary, fontFamily: 'AlanSans-Regular' }
                ]}
              >
                Adiciona transações quando detecta notificações de compra
              </Text>
            </View>
            <Switch
              value={config.autoCreateTransactions}
              onValueChange={(value) => handleConfigChange('autoCreateTransactions', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={config.autoCreateTransactions ? theme.colors.primary : theme.colors.secondary}
            />
          </View>

          {/* Notification Sound */}
          <View style={styles.configItem}>
            <View style={styles.configItemText}>
              <Text 
                style={[
                  styles.configItemTitle,
                  { color: theme.colors.text, fontFamily: 'AlanSans-SemiBold' }
                ]}
              >
                Som de Confirmação
              </Text>
              <Text 
                style={[
                  styles.configItemSubtitle,
                  { color: theme.colors.secondary, fontFamily: 'AlanSans-Regular' }
                ]}
              >
                Toca som quando uma transação é criada
              </Text>
            </View>
            <Switch
              value={config.notificationSound}
              onValueChange={(value) => handleConfigChange('notificationSound', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={config.notificationSound ? theme.colors.primary : theme.colors.secondary}
            />
          </View>
        </View>

        {/* Bancos Suportados */}
        <View style={[styles.banksCard, { backgroundColor: theme.colors.surface }]}>
          <Text 
            style={[
              styles.banksTitle,
              { color: theme.colors.text, fontFamily: 'AlanSans-Bold' }
            ]}
          >
            Bancos Suportados
          </Text>
          <View style={styles.banksList}>
            {[
              'Nubank', 'Itaú', 'Bradesco', 'Santander', 
              'PicPay', 'C6 Bank', 'Inter', 'BTG Pactual'
            ].map((bank, index) => (
              <View key={index} style={styles.bankItem}>
                <BanknotesIcon size={20} color={theme.colors.primary} />
                <Text 
                  style={[
                    styles.bankName,
                    { color: theme.colors.text, fontFamily: 'AlanSans-Regular' }
                  ]}
                >
                  {bank}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="Testar Parser"
            onPress={handleTestNotification}
            variant="outline"
            icon={<CogIcon size={20} color={theme.colors.primary} />}
          />
          
          <CustomButton
            title="Ajuda com Permissões"
            onPress={showPermissionsHelp}
            variant="secondary"
            icon={<InformationCircleIcon size={20} color={theme.colors.primary} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  statusCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    lineHeight: 24,
  },
  configCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  configTitle: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 16,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  configItemText: {
    flex: 1,
    marginRight: 16,
  },
  configItemTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  configItemSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  banksCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  banksTitle: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 16,
  },
  banksList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  bankName: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
});