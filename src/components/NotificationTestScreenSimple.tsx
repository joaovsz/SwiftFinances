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
      const testCount = NotificationTester.testBankMessages();
      setResults(`✅ Executados ${testCount} testes. Verifique o console para detalhes.`);
    } catch (error) {
      setResults(`❌ Erro ao executar testes: ${error}`);
    }
  };

  const testCustomMessage = async () => {
    if (!title && !body) {
      Alert.alert('Erro', 'Digite pelo menos o título ou corpo da mensagem');
      return;
    }

    try {
      const result = await NotificationTester.testCustomMessage(title, body, appId);
      
      if (result) {
        setResults(`✅ SUCESSO:\n` +
          `Valor: R$ ${(result.amount || 0).toFixed(2)}\n` +
          `Descrição: ${result.description}\n` +
          `Categoria: ${result.category || 'N/A'}\n` +
          `Estabelecimento: ${result.merchant || 'N/A'}\n` +
          `Tipo: ${result.type}`
        );
      } else {
        setResults('❌ Mensagem não reconhecida como transação bancária');
      }
    } catch (error) {
      setResults(`❌ Erro: ${error}`);
    }
  };

  const simulateFullNotification = async () => {
    if (!title && !body) {
      Alert.alert('Erro', 'Digite pelo menos o título ou corpo da mensagem');
      return;
    }

    try {
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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Testes Rápidos
        </Text>
        
        <CustomButton 
          title="🏦 Testar Todos os Bancos"
          onPress={runPresetTests}
          style={{ marginBottom: 8 }}
        />
        
        <View style={styles.presetButtonsContainer}>
          {presetMessages.map((preset, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setTitle(preset.title);
                setBody(preset.body);
                setAppId(preset.appId);
              }}
              style={styles.presetButton}
            >
              <Text style={styles.presetButtonText}>
                {preset.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Seção de Teste Personalizado */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Teste Personalizado
        </Text>
        
        <Text style={styles.inputLabel}>App ID:</Text>
        <TextInput
          value={appId}
          onChangeText={setAppId}
          placeholder="com.nubank.app"
          style={styles.textInput}
        />
        
        <Text style={styles.inputLabel}>Título da Notificação:</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Cartão de débito"
          style={styles.textInput}
        />
        
        <Text style={styles.inputLabel}>Corpo da Notificação:</Text>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Compra aprovada de R$ 25,50 no SUPERMERCADO XYZ"
          multiline
          numberOfLines={3}
          style={[styles.textInput, styles.multilineInput]}
        />
        
        <View style={styles.buttonRow}>
          <CustomButton 
            title="🔍 Testar Parser"
            onPress={testCustomMessage}
            style={{ flex: 1, marginRight: 8 }}
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
        <View style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>
            📋 Resultados:
          </Text>
          <ScrollView style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {results}
            </Text>
          </ScrollView>
          <TouchableOpacity 
            onPress={() => setResults('')}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Instruções */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>
          💡 Como Testar:
        </Text>
        <Text style={styles.instructionsText}>
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
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  presetButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  presetButtonText: {
    color: '#1e40af',
    fontSize: 12,
  },
  inputLabel: {
    color: '#6b7280',
    marginBottom: 8,
    fontSize: 14,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#1f2937',
    backgroundColor: 'white',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  resultsCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  resultsContainer: {
    maxHeight: 200,
  },
  resultsText: {
    color: '#10b981',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 16,
  },
  clearButton: {
    marginTop: 8,
    backgroundColor: '#dc2626',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
  },
  instructionsCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  instructionsText: {
    color: '#1d4ed8',
    fontSize: 14,
    lineHeight: 20,
  },
});