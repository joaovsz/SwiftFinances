import React from "react";
import { FlatList, Text, View } from "react-native";
import tw from "twrnc";
import Row from "./Row";
import { useFinances } from "../context/FinancesContext";

export default function Lista() {
  const { state } = useFinances();

  return (
    <FlatList
      data={state.transaction}
      ListEmptyComponent={() => (
        <View className={`flex-1 justify-center items-center p-4`}>
          <Text className={`text-gray-500 text-center`}>
            Nenhuma transação encontrada
          </Text>
        </View>
      )}
      renderItem={(item) => (
        <Row
          transaction={item.item}
          title={item.item.label}
          value={item.item.value}
          type={item.item.type}
          onPress={() => {}}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      className={` rounded-2xl `}
    />
  );
}
