import DateTimePicker from "@react-native-community/datetimepicker";
import * as SQLite from "expo-sqlite";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
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

const TransactionModal = () => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("Entrada");
  // const { create } = useTransactionDatabase();
  const {
    openAddTransactionModal,
    setOpenAddTransactionModal,
    addTransaction,
  } = useFinances();

  const handleAddTransaction = async () => {
    console.log(parseFromBRL(amount));
    const db = await SQLite.openDatabaseAsync("transactions");
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
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
        className="flex-1 justify-center items-center "
      >
        <KeyboardAvoidingView className={`bg-[#101010] p-6 rounded-xl w-11/12`}>
          <Button
            onPress={() => setOpenAddTransactionModal(false)}
            className="rounded-lg absolute right-0 top-2 bg-transparent z-10"
          >
            <View className="flex flex-row justify-center w-full">
              <XMarkIcon size={25} color={"#fff"} />
            </View>
          </Button>
          <Text className="text-xl text-white mb-4 font-outfit-bold">
            Adicionar Transação
          </Text>
          <View className="  mb-4">
            <TextInput
              style={{ height: 35 }}
              mode={"outlined"}
              theme={{ colors: { primary: "#fff" } }}
              label="Nome"
              value={name}
              onChangeText={setName}
              left={
                <TextInput.Icon
                  icon={() => (
                    <ChatBubbleBottomCenterIcon
                      size={20}
                      color={`${theme.colors.text}`}
                    />
                  )}
                />
              }
            />
            <TextInput
              label="Valor"
              value={amount}
              mode={"outlined"}
              textColor="#fff"
              theme={{ colors: { primary: "#fff" } }}
              onChangeText={(text) => {
                const formattedAmount = text
                  .replace(/\D/g, "")
                  .replace(/(\d)(\d{2})$/, "$1,$2")
                  .replace(/(?=(\d{3})+(\D))\B/g, ".");
                setAmount(formattedAmount);
              }}
              style={{ height: 35 }}
              keyboardType="number-pad"
              className=""
              left={
                <TextInput.Icon
                  icon={() => (
                    <CurrencyDollarIcon
                      size={20}
                      color={`${theme.colors.text}`}
                    />
                  )}
                />
              }
            />
          </View>

          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="mb-4 p-3 border border-gray-300 rounded-lg"
          >
            <Text>{date.toLocaleDateString("pt-BR")}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              textColor="white"
              themeVariant="dark"
              display="default"
              locale="pt-BR"
              className="text-white"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          <View className="flex-row justify-between mb-4">
            <Pressable
              className={`flex-1 p-3 border border-gray-300 rounded-lg mr-2 ${
                category === "Entrada" ? "bg-blue-100" : "text-white"
              }`}
              onPress={() => setCategory("Entrada")}
            >
              <Text className="text-center">Entrada</Text>
            </Pressable>
            <Pressable
              className={`flex-1 p-3 border border-gray-300 rounded-lg ${
                category === "Saída" ? "bg-blue-100 text-white" : "text-white"
              }`}
              onPress={() => setCategory("Saída")}
            >
              <Text className="text-center">Saída</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={handleAddTransaction}
            className="py-2 w-full rounded-lg items-center justify-center flex flex-row border border-green-500 bg-green-100"
          >
            <View className="flex-row w-full items-center justify-center">
              <PlusCircleIcon size={20} color={"#000"} />
              <Text className="text-black w-20 text-center font-medium">
                Incluir
              </Text>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default TransactionModal;
