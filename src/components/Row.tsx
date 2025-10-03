import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import tw from "twrnc";
import { formatToBRL } from "../utils/utils";
import MinusIcon from "./icons/MinusIcon";
import { useFinances } from "../context/FinancesContext";
import { Transaction } from "../models/transaction";
import { useTheme } from "../context/ThemeContext";

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
      style={{
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        padding: 16,
        marginVertical: 4,
        elevation: isDark ? 3 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 4,
        borderWidth: isDark ? 0 : 1,
        borderColor: isDark ? 'transparent' : theme.colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 26, paddingVertical: 2 }}>
        <Text 
          style={{ 
            color: theme.colors.text,
            fontSize: 14,
            lineHeight: 22,
            textAlignVertical: 'center',
            fontFamily: 'AlanSans-Regular',
            flex: 1,
            paddingVertical: 2
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: type == 1 ? (isDark ? '#22c55e' : '#16a34a') : (isDark ? '#ef4444' : '#dc2626'),
            fontSize: 14,
            lineHeight: 22,
            fontFamily: 'AlanSans-Bold',
            marginLeft: 'auto',
            paddingVertical: 2,
            textAlign: 'right'
          }}
        >
          {formatToBRL(value)}
        </Text>
        <Pressable onPress={() => removeTransactions(transaction)}>
          <MinusIcon />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};

export default Row;
