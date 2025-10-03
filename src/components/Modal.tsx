import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import {
  ChatBubbleBottomCenterIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { Button } from "react-native-paper";

import { useFinances } from "../context/FinancesContext";
import { Transaction } from "../models/transaction";
import { parseFromBRL } from "../utils/utils";
import { useTheme } from "../context/ThemeContext";
import { CustomTextInput, CustomDatePicker, CustomCategorySelector, CustomButton } from "./inputs";

// Conditional import for SQLite
let SQLite: any = null;
if (Platform.OS !== 'web') {
  SQLite = require('expo-sqlite');
}

const TransactionModal = () => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("Entrada");
  const { db } = useFinances();
  const {
    openAddTransactionModal,
    setOpenAddTransactionModal,
    addTransaction,
  } = useFinances();

  const categoryOptions = [
    { value: "Entrada", label: "Entrada" },
    { value: "Saída", label: "Saída" }
  ];

  const handleAddTransaction = async () => {
    console.log(parseFromBRL(amount));
    if (!name || !amount) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    const transaction: Transaction = {
      id: Date.now(),
      label: name,
      value: parseFromBRL(amount),
      date: date.toISOString(),
      type: category === "Entrada" ? 1 : 2,
    };
    try {
      console.log(db);
      console.log(transaction);
      
      if (Platform.OS === 'web') {
        // For web, data is handled in addTransaction function via localStorage
      } else {
        // For mobile, use SQLite
        if (db)
          await db.runAsync(
            `INSERT INTO transactions (id, label, value, type, created_at) VALUES (?, ?, ?, ?, ?)`,
            [
              transaction.id,
              transaction.label,
              transaction.value,
              transaction.type,
              transaction.date,
            ]
          );
      }

      addTransaction(transaction);
      setOpenAddTransactionModal(false);
      setAmount("");
      setName("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      visible={openAddTransactionModal}
      transparent={true}
      animationType="slide"
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
        className="flex-1 justify-center items-center px-4"
      >
        <KeyboardAvoidingView 
          style={{
            width: '100%',
            maxWidth: 400,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              padding: 24,
              elevation: 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            }}
          >
            <View style={{ position: 'relative' }}>
              <Pressable
                onPress={() => setOpenAddTransactionModal(false)}
                style={{
                  position: 'absolute',
                  right: -8,
                  top: -8,
                  zIndex: 10,
                  backgroundColor: theme.colors.primary,
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <XMarkIcon size={24} color="white" />
              </Pressable>
              
              <Text 
                style={{ 
                  color: theme.colors.text,
                  fontFamily: 'AlanSans-Bold',
                  fontSize: 24,
                  textAlign: 'center',
                  marginBottom: 24
                }}
              >
                Nova Transação
              </Text>
              <CustomTextInput
                label="Nome da Transação"
                value={name}
                onChangeText={setName}
                fontWeight="400"
                icon={
                  <ChatBubbleBottomCenterIcon
                    size={20}
                    color={theme.colors.primary}
                  />
                }
              />
              
              <CustomTextInput
                label="Valor"
                value={amount}
                onChangeText={(text: string) => {
                  const formattedAmount = text
                    .replace(/\D/g, "")
                    .replace(/(\d)(\d{2})$/, "$1,$2")
                    .replace(/(?=(\d{3})+(\D))\B/g, ".");
                  setAmount(formattedAmount);
                }}
                keyboardType="number-pad"
                fontWeight="400"
                icon={
                  <CurrencyDollarIcon
                    size={20}
                    color={theme.colors.primary}
                  />
                }
              />

              <CustomDatePicker
                value={date}
                onChange={setDate}
              />

              <CustomCategorySelector
                options={categoryOptions}
                selectedValue={category}
                onValueChange={setCategory}
              />

              <CustomButton
                title="Adicionar Transação"
                onPress={handleAddTransaction}
                size="large"
                style={{ marginTop: 24 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default TransactionModal;
