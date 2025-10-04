import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { NotificationTester } from '../services/NotificationTester';
import { CustomButton } from './inputs/CustomButton';

export function NotificationTestScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [appId, setAppId] = useState('com.nubank.app');
  const [results, setResults] = useState<string>('');

  const runPresetTests = () => {
    try {
      console.log('Executando testes pré-definidos...');
      const testCount = NotificationTester.testBankMessages();
      setResults(`✅ Executados ${testCount} testes. Verifique o console para detalhes.`);
    } catch (error) {
      console.error('Erro ao executar testes:', error);
      setResults(`❌ Erro ao executar testes: ${error}`);
    }
  };

  const testCustomMessage = async () => {
    if (!title && !body) {
      Alert.alert('Erro', 'Digite pelo menos o título ou corpo da mensagem');
      return;
    }

    try {
      console.log('Testando mensagem personalizada...');
      const result = await NotificationTester.testCustomMessage(title, body, appId);
      
      if (result) {
        const amount = result.amount || 0;
        setResults(`✅ SUCESSO:\n` +
          `Valor: R$ ${amount.toFixed(2)}\n` +
          `Descrição: ${result.description}\n` +
          `Categoria: ${result.category || 'N/A'}\n` +
          `Estabelecimento: ${result.merchant || 'N/A'}\n` +
          `Tipo: ${result.type}`
        );
      } else {
        setResults('❌ Mensagem não reconhecida como transação bancária');
      }
    } catch (error) {
      console.error('Erro ao testar mensagem:', error);
      setResults(`❌ Erro: ${error}`);
    }
  };

  const simulateFullNotification = async () => {
    if (!title && !body) {
      Alert.alert('Erro', 'Digite pelo menos o título ou corpo da mensagem');
      return;
    }

    try {
      console.log('Simulando notificação completa...');
      const result = await NotificationTester.simulateNotification(title, body, appId);
      
      if (result) {
        const amount = result.value || 0;
        setResults(`📲 SIMULAÇÃO COMPLETA:\n` +
          `✅ Parser: Funcionou\n` +
          `💰 Valor: R$ ${amount.toFixed(2)}\n` +
          `📝 Descrição: ${result.label}\n` +
          `🏷️ Categoria: ${result.category || 'Compra Automática'}\n` +
          `🏪 Estabelecimento: ${result.merchant || 'N/A'}\n` +
          `📊 Tipo: ${result.type}\n\n` +
          `🔄 Transação que seria criada:\n` +
          `- Tipo: Saída (2)\n` +
          `- Valor: ${amount}\n` +
          `- Data: ${new Date().toLocaleString()}\n` +
          `- Automática: Sim`
        );
      } else {
        setResults('❌ Simulação falhou - mensagem não reconhecida');
      }
    } catch (error) {
      console.error('Erro na simulação:', error);
      setResults(`❌ Erro na simulação: ${error}`);
    }
  };

  const presetMessages = [
    {
      name: 'Nubank - Compra',
      title: 'Cartão de débito',
      body: 'Compra aprovada de R$ 25,50 no SUPERMERCADO XYZ',
      appId: 'com.nubank.app'
    },
    {
      name: 'Itaú - Débito',
      title: 'Itaú Débito',  
      body: 'Débito de R$ 45,30 - UBER TRIP 12345',
      appId: 'com.itau.app'
    },
    {
      name: 'PicPay - Pagamento',
      title: 'Pagamento realizado',
      body: 'Você pagou R$ 89,90 para FARMACIA POPULAR',
      appId: 'com.picpay.app'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        🧪 Teste de Notificações Bancárias
      </Text>

      {/* Seção de Testes Rápidos */}
      <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Testes Rápidos
        </Text>
        
        <CustomButton 
          title="🏦 Testar Todos os Bancos"
          onPress={runPresetTests}
          style={{ marginBottom: 8 }}
        />
        
        <View className="flex-row flex-wrap gap-2">
          {presetMessages.map((preset, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setTitle(preset.title);
                setBody(preset.body);
                setAppId(preset.appId);
              }}
              className="bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded-lg"
            >
              <Text className="text-blue-800 dark:text-blue-200 text-sm">
                {preset.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Seção de Teste Personalizado */}
      <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Teste Personalizado
        </Text>
        
        <Text className="text-gray-600 dark:text-gray-400 mb-2">App ID:</Text>
        <TextInput
          value={appId}
          onChangeText={setAppId}
          placeholder="com.nubank.app"
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3 text-gray-800 dark:text-white bg-white dark:bg-gray-700"
        />
        
        <Text className="text-gray-600 dark:text-gray-400 mb-2">Título da Notificação:</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Cartão de débito"
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3 text-gray-800 dark:text-white bg-white dark:bg-gray-700"
        />
        
        <Text className="text-gray-600 dark:text-gray-400 mb-2">Corpo da Notificação:</Text>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Compra aprovada de R$ 25,50 no SUPERMERCADO XYZ"
          multiline
          numberOfLines={3}
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4 text-gray-800 dark:text-white bg-white dark:bg-gray-700"
        />
        
        <View className="flex-row gap-2">
          <CustomButton 
            title="🔍 Testar Parser"
            onPress={testCustomMessage}
            style={{ flex: 1 }}
          />
          <CustomButton 
            title="📲 Simular Completo"
            onPress={simulateFullNotification}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Resultados */}
      {results ? (
        <View className="bg-gray-800 rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-white mb-2">
            📋 Resultados:
          </Text>
          <ScrollView className="max-h-80">
            <Text className="text-green-400 font-mono text-sm">
              {results}
            </Text>
          </ScrollView>
          <TouchableOpacity 
            onPress={() => setResults('')}
            className="mt-2 bg-red-600 rounded px-3 py-1 self-end"
          >
            <Text className="text-white">Limpar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Instruções */}
      <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <Text className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          💡 Como Testar:
        </Text>
        <Text className="text-blue-700 dark:text-blue-300 text-sm">
          1. Use os testes rápidos para verificar se todos os bancos funcionam{'\n'}
          2. Copie mensagens reais dos seus bancos para testar{'\n'}
          3. O "Testar Parser" só verifica a extração de dados{'\n'}
          4. O "Simular Completo" testa todo o fluxo de criação de transação{'\n'}
          5. Verifique os logs no console do React Native para mais detalhes
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
});