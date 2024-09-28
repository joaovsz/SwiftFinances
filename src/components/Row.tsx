import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import tw from "twrnc";
import { formatToBRL } from "../utils/utils";
import MinusIcon from "./icons/MinusIcon";
import { useFinances } from "../context/FinancesContext";
import { Transaction } from "../models/transaction";

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

  function removeTransactions(transaction: Transaction) {
    removeTransaction(transaction.id);
    const forRemove = {
      type: type,
      amount: transaction.value,
    };
    minusTransaction(forRemove);
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 border border-gray-700 rounded-2xl my-1 bg-[#101010]`}
    >
      <View className={`flex-row items-center gap-2`}>
        <Text className={`text-[16px] flex-1 font-outfit-light text-white`}>
          {title}
        </Text>
        <Text
          className={`text-sm font-outfit-bold ${
            type == 1 ? "text-green-500" : "text-red-500"
          } ml-auto`}
        >
          {formatToBRL(value)}
        </Text>
        <Pressable onPress={() => removeTransactions(transaction)}>
          <MinusIcon
          // color={"#ef4444"}
          // size={18}
          />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};

export default Row;
