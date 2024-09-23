import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PlusCircleIcon, XMarkIcon } from "react-native-heroicons/outline";
import { Button } from "react-native-paper";
import tw from "twrnc";
import * as SQLite from "expo-sqlite";
import { useFinances } from "../context/FinancesContext";
import { Transaction } from "../types/transaction";

const TransactionModal = () => {
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
    const db = SQLite.openDatabaseSync("transactions");
    if (isNaN(Number(amount))) {
      Alert.alert("Por favor, insira um valor numérico válido.");
      return;
    }
    const transaction: Transaction = {
      id: Date.now(),
      label: name,
      value: Number(amount),
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
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView style={styles.modalContent}>
          <Button
            onPress={() => setOpenAddTransactionModal(false)}
            className={`rounded-[8px] absolute right-0 top-2  bg-transparent flex-1 z-10`}
          >
            <View className={`flex flex-row justify-center w-full`}>
              <XMarkIcon size={25} color={"#000"} />
            </View>
          </Button>
          <Text style={styles.title}>Adicionar Transação</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            keyboardType="default"
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor"
            keyboardType="numbers-and-punctuation"
            value={amount}
            onChangeText={setAmount}
          />
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.datePicker}
          >
            <Text>{date.toDateString()}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              locale="pt-BR"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          <View style={styles.categoryContainer}>
            <Pressable
              style={[
                styles.categoryButton,
                category === "Entrada" && styles.selectedCategory,
              ]}
              onPress={() => setCategory("Entrada")}
            >
              <Text className={`w-full text-center`}>Entrada</Text>
            </Pressable>
            <Pressable
              style={[
                styles.categoryButton,
                category === "Saída" && styles.selectedCategory,
              ]}
              onPress={() => setCategory("Saída")}
            >
              <Text className={`w-full text-center`}>Saída</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={handleAddTransaction}
            className={`py-2 w-full rounded-[12px] items-center justify-center flex flex-row border border-green-500 bg-green-100 `}
          >
            <View className={`flex-row w-full items-center justify-center  `}>
              <PlusCircleIcon size={20} color={"#000"} />
              <Text
                className={`text-black w-[80px] text-center font-outfit-medium`}
              >
                Incluir
              </Text>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    width: "100%",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  datePicker: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    flexDirection: "row",

    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: "#c6c6c6",
    flex: 1,
    width: "100%",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    marginLeft: 10,
  },
});

export default TransactionModal;
