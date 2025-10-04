import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Transaction } from '../models/transaction';
import { BankMessageParser } from './BankMessageParser';

export interface NotificationServiceConfig {
    enabled: boolean;
    monitoredApps: string[];
    autoCreateTransactions: boolean;
    notificationSound: boolean;
}

class NotificationServiceClass {
    private isListening: boolean = false;
    private config: NotificationServiceConfig = {
        enabled: false,
        monitoredApps: [
            'com.banco.bradesco',
            'com.itau.app',
            'com.santander.app',
            'com.caixa.app',
            'com.nubank.app',
            'com.btg.pactual.app',
            'com.inter.app',
            'com.bancooriginal.app',
            'com.c6bank.app',
            'com.picpay.app',
        ],
        autoCreateTransactions: true,
        notificationSound: false,
    };

    private listeners: ((transaction: Transaction) => void)[] = [];

    constructor() {
        this.loadConfig();
        this.setupNotificationHandler();
    }

    // Configurar o handler de notificações
    private setupNotificationHandler() {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: this.config.notificationSound,
                shouldPlaySound: this.config.notificationSound,
                shouldSetBadge: false,
            }),
        });
    }

    // Carregar configurações salvas
    private async loadConfig() {
        try {
            const savedConfig = await AsyncStorage.getItem('notification_service_config');
            if (savedConfig) {
                this.config = { ...this.config, ...JSON.parse(savedConfig) };
            }
        } catch (error) {
            console.log('Erro ao carregar configurações:', error);
        }
    }

    // Salvar configurações
    private async saveConfig() {
        try {
            await AsyncStorage.setItem('notification_service_config', JSON.stringify(this.config));
        } catch (error) {
            console.log('Erro ao salvar configurações:', error);
        }
    }

    // Solicitar permissões
    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('bank-transactions', {
                name: 'Transações Bancárias',
                importance: Notifications.AndroidImportance.DEFAULT,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                return false;
            }

            // Para Android, precisamos de permissão especial para acessar notificações
            if (Platform.OS === 'android') {
                console.log('⚠️ Para funcionar completamente, você precisa:');
                console.log('1. Ir em Configurações > Aplicativos > SwiftFinances');
                console.log('2. Permissões > Notificações > Ativar');
                console.log('3. Acesso especial > Acesso às notificações > Ativar SwiftFinances');
            }

            return true;
        }

        return false;
    }

    // Iniciar monitoramento
    async startMonitoring(): Promise<boolean> {
        if (this.isListening) return true;

        const hasPermission = await this.requestPermissions();
        if (!hasPermission) {
            throw new Error('Permissões de notificação não concedidas');
        }

        this.config.enabled = true;
        await this.saveConfig();

        // Listener para notificações recebidas
        const receivedSubscription = Notifications.addNotificationReceivedListener(
            this.handleNotificationReceived.bind(this)
        );

        // Listener para quando o usuário toca na notificação
        const responseSubscription = Notifications.addNotificationResponseReceivedListener(
            this.handleNotificationResponse.bind(this)
        );

        this.isListening = true;
        console.log('📱 Monitoramento de notificações bancárias ativado');

        return true;
    }

    // Parar monitoramento
    async stopMonitoring() {
        this.config.enabled = false;
        await this.saveConfig();

        this.isListening = false;

        console.log('📱 Monitoramento de notificações bancárias desativado');
    }

    // Processar notificação recebida
    private async handleNotificationReceived(notification: Notifications.Notification) {
        if (!this.config.enabled) return;

        const { title, body, data } = notification.request.content;
        const appId = data?.appId || '';

        // Verificar se é de um app bancário monitorado
        if (!this.isAppMonitored(appId)) return;

        console.log('📱 Notificação bancária recebida:', { title, body, appId });

        // Tentar extrair informações da transação
        const transactionInfo = BankMessageParser.parseMessage(title || '', body || '', appId);

        if (transactionInfo && this.config.autoCreateTransactions) {
            // Criar transação automaticamente
            const transaction: Transaction = {
                id: Date.now(),
                label: transactionInfo.description,
                value: transactionInfo.amount,
                type: 2, // Saída
                date: new Date().toISOString(),
                category: transactionInfo.category || 'Outros',
                isAutomatic: true,
            };

            // Notificar listeners (contexto de finanças)
            this.notifyListeners(transaction);

            // Mostrar notificação de confirmação
            await this.showTransactionCreatedNotification(transaction);
        }
    }

    // Processar resposta à notificação
    private handleNotificationResponse(response: Notifications.NotificationResponse) {
        console.log('📱 Usuário tocou na notificação:', response);
    }

    // Verificar se app está sendo monitorado
    private isAppMonitored(appId: string): boolean {
        return this.config.monitoredApps.some(monitoredApp =>
            appId.includes(monitoredApp) || monitoredApp.includes(appId)
        );
    }

    // Mostrar notificação de transação criada
    private async showTransactionCreatedNotification(transaction: Transaction) {
        // Validação para evitar erro com valores inválidos
        const value = transaction.value || 0;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: '💰 Transação Criada Automaticamente',
                body: `${transaction.label}: -R$ ${value.toFixed(2)}`,
                data: { transactionId: transaction.id },
                sound: this.config.notificationSound,
            },
            trigger: null, // Imediata
        });
    }

    // Adicionar listener para transações criadas
    addTransactionListener(listener: (transaction: Transaction) => void) {
        this.listeners.push(listener);
    }

    // Remover listener
    removeTransactionListener(listener: (transaction: Transaction) => void) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    // Notificar todos os listeners
    private notifyListeners(transaction: Transaction) {
        console.log(`🔔 NotificationService: Notificando ${this.listeners.length} listeners com transação:`, transaction);
        this.listeners.forEach((listener, index) => {
            console.log(`📞 NotificationService: Chamando listener ${index + 1}`);
            try {
                listener(transaction);
                console.log(`✅ NotificationService: Listener ${index + 1} executado com sucesso`);
            } catch (error) {
                console.error(`❌ NotificationService: Erro no listener ${index + 1}:`, error);
            }
        });
    }    // Getters e Setters para configuração
    getConfig(): NotificationServiceConfig {
        return { ...this.config };
    }

    async updateConfig(newConfig: Partial<NotificationServiceConfig>) {
        this.config = { ...this.config, ...newConfig };
        await this.saveConfig();
    }

    isEnabled(): boolean {
        return this.config.enabled && this.isListening;
    }

    // Teste manual (para desenvolvimento)
    async testNotificationParser(title: string, body: string, appId: string = 'com.nubank.app') {
        const result = BankMessageParser.parseMessage(title, body, appId);
        console.log('🔍 Teste do parser:', { input: { title, body, appId }, result });
        return result;
    }

    // Simular criação de transação automática (para testes)
    async simulateAutomaticTransaction(title: string, body: string, appId: string = 'com.nubank.app') {
        console.log('🧪 Simulando criação de transação automática...');

        const transactionInfo = BankMessageParser.parseMessage(title, body, appId);

        if (transactionInfo) {
            console.log('✅ Parser funcionou:', transactionInfo);

            // Criar transação como faria o handleNotificationReceived
            const transaction: Transaction = {
                id: Date.now(),
                label: transactionInfo.description,
                value: transactionInfo.amount,
                type: 2, // Saída
                date: new Date().toISOString(),
                category: transactionInfo.category || 'Outros',
                isAutomatic: true,
            };

            console.log('📝 Criando transação:', transaction);

            // Notificar listeners (FinancesProvider)
            console.log(`🔔 Notificando ${this.listeners.length} listeners...`);
            this.notifyListeners(transaction);

            return transaction;
        } else {
            console.log('❌ Parser falhou - não foi possível extrair dados');
            return null;
        }
    }
}

export const NotificationService = new NotificationServiceClass();