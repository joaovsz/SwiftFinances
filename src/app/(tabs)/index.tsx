import HeaderUser from "@/src/components/HeaderUser";
import ExpensesIcon from "@/src/components/icons/ExpensesIcon";
import IncomeIcon from "@/src/components/icons/IncomeIcon";
import TotalIcon from "@/src/components/icons/TotalIcon";
import TransactionModal from "@/src/components/Modal";
import tw from "twrnc";
import { useFinances } from "@/src/context/FinancesContext";
import { formatToBRL } from "@/src/utils/utils";
import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Lista from "@/src/components/Lista";
import { useTheme } from "@/src/context/ThemeContext";

export default function Home() {
  const { totalAmount, state, incomes, expenses, calculateIncomes } =
    useFinances();
  const { theme, isDark } = useTheme();
  useEffect(() => {
    calculateIncomes(state.totalIncomes);
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <TransactionModal />
      <View className="h-[85%] w-full py-6 gap-6 px-4">
        <HeaderUser />
        
        <Text
          className={`${
            !isDark ? "text-black" : "text-white"
          } font-alan-semibold text-[24px] text-left mb-4`}
        >
          Resumo Financeiro
        </Text>
        
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flexDirection: "row",
            height: 90,
          }}
          className="flex-row gap-4 max-h-[150px]"
        >
          <View
            className="p-6 w-[320px] items-left h-full justify-around rounded-2xl mr-4"
            style={{
              backgroundColor: theme.colors.surface,
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <View className="flex flex-row gap-2 w-1/2 items-center max-h-[150px]">
              <TotalIcon />
              <Text className={`${isDark ? 'text-white' : 'text-gray-800'} font-alan-regular text-2xl`}>
                Saldo
              </Text>
            </View>
            <Text className={`${isDark ? 'text-blue-400' : 'text-blue-600'} text-left font-alan-semibold text-3xl w-full`}>
              {formatToBRL(totalAmount)}
            </Text>
          </View>

          <View className="gap-4 h-full" style={{ height: 90 }}>
            <View
              className="p-4 w-[320px] flex flex-row items-center justify-between h-[68px] rounded-2xl mr-4"
              style={{
                backgroundColor: theme.colors.surface,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
              }}
            >
              <View className="flex flex-row w-1/2 gap-2 items-center">
                <IncomeIcon />
                <Text className={`${isDark ? 'text-blue-200' : 'text-blue-700'} text-xl font-alan-regular`}>
                  Entradas
                </Text>
              </View>
              <Text
                className={`${isDark ? 'text-white' : 'text-gray-800'} font-alan-semibold w-1/2 text-right text-xl`}
              >
                {formatToBRL(incomes)}
              </Text>
            </View>
            <View
              className="p-4 w-[320px] flex flex-row items-center justify-between h-[68px] rounded-2xl mr-4"
              style={{
                backgroundColor: theme.colors.surface,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
              }}
            >
              <View className="flex flex-row w-1/2 gap-2 items-center">
                <ExpensesIcon />
                <Text className={`${isDark ? 'text-red-200' : 'text-red-700'} text-xl font-alan-regular`}>
                  Saídas
                </Text>
              </View>
              <Text className="text-red-500 font-alan-semibold w-1/2 text-right text-xl">
                - {formatToBRL(expenses)}
              </Text>
            </View>
          </View>
        </ScrollView>
        
        <View className="flex flex-row items-center justify-between w-full mb-4">
          <Text
            className={`${
              !isDark ? "text-black" : "text-white"
            } text-[20px] font-alan-bold w-1/2 text-left`}
          >
            Transações Recentes
          </Text>
        </View>
        <Lista />
      </View>
    </SafeAreaView>
  );
}
