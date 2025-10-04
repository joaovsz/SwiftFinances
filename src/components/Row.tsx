import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable, Animated, Dimensions } from "react-native";
import tw from "twrnc";
import { formatToBRL } from "../utils/utils";
import MinusIcon from "./icons/MinusIcon";
import { useFinances } from "../context/FinancesContext";
import { Transaction } from "../models/transaction";
import { useTheme } from "../context/ThemeContext";
import { BellIcon, PencilIcon, TrashIcon } from "react-native-heroicons/outline";
import { EditTransactionModal } from "./EditTransactionModal";
import { PanGestureHandler, State } from 'react-native-gesture-handler';

interface RowProps {
  title: string;
  value: number;
  onPress: () => void;
  type: 1 | 2 | number;
  transaction: Transaction;
}

const Row: React.FC<RowProps> = ({
  title,
  value,
  transaction,
  onPress,
  type,
}) => {
  const { removeTransaction, minusTransaction } = useFinances();
  const { theme, isDark } = useTheme();
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Animação para o swipe
  const translateX = new Animated.Value(0);
  const borderRadius = new Animated.Value(16); // Controla o borderRadius
  const screenWidth = Dimensions.get('window').width;
  const actionWidth = 140; // Largura das ações (70px cada botão)

  function removeTransactions(transaction: Transaction) {
    // Fechar swipe antes de remover
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.spring(borderRadius, {
        toValue: 16,
        useNativeDriver: false,
      })
    ]).start();
    
    removeTransaction(transaction.id);
    const forRemove = {
      type: type,
      amount: transaction.value,
    };
    minusTransaction(forRemove);
  }

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { 
      useNativeDriver: false, // Precisa ser false para animar borderRadius
      listener: (event: any) => {
        const { translationX } = event.nativeEvent;
        // Animar borderRadius baseado na posição do swipe
        const progress = Math.min(Math.abs(translationX) / 50, 1);
        const newRadius = 16 * (1 - progress);
        borderRadius.setValue(newRadius);
      }
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      
      // Se deslizou para a esquerda mais de 50px, mostrar ações
      if (translationX < -50) {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: -actionWidth,
            useNativeDriver: false,
          }),
          Animated.spring(borderRadius, {
            toValue: 0, // Remove borderRadius do lado direito
            useNativeDriver: false,
          })
        ]).start();
      } else {
        // Voltar para posição original
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }),
          Animated.spring(borderRadius, {
            toValue: 16, // Restaura borderRadius completo
            useNativeDriver: false,
          })
        ]).start();
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Data não disponível';
      
      const date = new Date(dateString);
      
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      
      // Formatar data e hora separadamente para melhor compatibilidade
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };
      
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit'
      };
      
      const dateStr = date.toLocaleDateString('pt-BR', dateOptions);
      const timeStr = date.toLocaleTimeString('pt-BR', timeOptions);
      
      return `${dateStr}, ${timeStr}`;
    } catch (error) {
      console.warn('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };
  
  return (
    <>
      <View style={{
        marginVertical: 4,
        backgroundColor: 'transparent',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        {/* Botões de ação atrás */}
        <View style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: actionWidth,
          flexDirection: 'row',
        }}>
          {/* Botão Editar */}
          <Pressable
            onPress={() => {
              setShowEditModal(true);
              // Fechar swipe após pressionar
              Animated.parallel([
                Animated.spring(translateX, {
                  toValue: 0,
                  useNativeDriver: false,
                }),
                Animated.spring(borderRadius, {
                  toValue: 16,
                  useNativeDriver: false,
                })
              ]).start();
            }}
            style={{
              flex: 1,
              backgroundColor: '#3b82f6',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PencilIcon size={20} color="white" />
            <Text style={{ color: 'white', fontSize: 10, marginTop: 2 }}>Editar</Text>
          </Pressable>
          
          <Pressable
            onPress={() => removeTransactions(transaction)}
            style={{
              flex: 1,
              backgroundColor: '#ef4444',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TrashIcon size={20} color="white" />
            <Text style={{ color: 'white', fontSize: 10, marginTop: 2 }}>Excluir</Text>
          </Pressable>
        </View>

        {/* Conteúdo principal com swipe */}
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
                    onHandlerStateChange={onHandlerStateChange}
          activeOffsetX={[-10, 10]}
        >
          <Animated.View
            style={{
              transform: [{ translateX }],
            }}
          >
            <Pressable
              onPress={onPress}
              style={({ pressed }) => ({
                
                elevation: isDark ? 3 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.3 : 0.05,
                shadowRadius: 4,
                borderWidth: isDark ? 0 : 1,
                borderColor: isDark ? 'transparent' : theme.colors.border,
              })}
            >
              {/* Linha principal com título e valor */}
              <Animated.View style={{
                flexDirection: 'row', alignItems: 'flex-start', gap: 8,
                backgroundColor: theme.colors.card,
                borderRadius: borderRadius,
                padding: 16,
               }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
                  {transaction.isAutomatic && (
                    <BellIcon size={16} color={theme.colors.primary} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text 
                      style={{ 
                        color: theme.colors.text,
                        fontSize: 15,
                        lineHeight: 20,
                        fontFamily: 'AlanSans-Regular',
                        fontWeight: '500'
                      }}
                    >
                      {title}
                      {transaction.isAutomatic && (
                        <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '400' }}> (Auto)</Text>
                      )}
                    </Text>
                    
                    <Text 
                      style={{ 
                        color: theme.colors.text + '80',
                        fontSize: 12,
                        lineHeight: 16,
                        fontFamily: 'AlanSans-Regular',
                        marginTop: 2
                      }}
                    >
                      {formatDate(transaction.date)}
                      {transaction.category && ` • ${transaction.category}`}
                    </Text>
                  </View>
                  
                </View>
                
                <View>
                  <Text
                    style={{
                      color: type == 1 ? (isDark ? '#22c55e' : '#16a34a') : (isDark ? '#ef4444' : '#dc2626'),
                      fontSize: 16,
                      lineHeight: 20,
                      fontFamily: 'AlanSans-Bold',
                      textAlign: 'right'
                    }}
                  >
                    {formatToBRL(value)}
                  </Text>
                  
                  <View style={{ 
                    alignItems: 'center', 
                    marginTop: 8,
                    opacity: 0.5 
                  }}>
                    <Text style={{ 
                      fontSize: 10, 
                      color: theme.colors.text + '60',
                      fontStyle: 'italic'
                    }}>
                      ← Deslize para opções
                    </Text>
                  </View>
                </View>
                
              </Animated.View>
              
            </Pressable>
            
          </Animated.View>
        </PanGestureHandler>
      </View>

      <EditTransactionModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        transaction={transaction}
      />
    </>
  );
};

export default Row;
