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
        backgroundColor: `${theme.colors.background}`,
        flex: 1,
      }}
    >
      {<TransactionModal />}
      <View className={`h-[85%] w-full py-4 gap-4 px-3 `}>
        {/* 72px */}
        <HeaderUser />
        <Text
          className={`${
            !isDark ? "text-black" : "text-white"
          }  font-outfit-medium text-[20px] text-left pl-2`}
        >
          Resumo
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flexDirection: "row",
            height: 90,
          }}
          className={`flex-row gap-4 max-h-[150px]`}
        >
          <View
            className={`p-4 bg-[#101010] w-[320px] items-left h-full justify-around rounded-2xl mr-4`}
          >
            <View
              className={`flex flex-row gap-2 w-1/2 items-center max-h-[150px]`}
            >
              <TotalIcon />
              <Text className={`text-[#fff] font-outfit-regular text-2xl`}>
                Saldo
              </Text>
            </View>
            <Text
              className={`text-green-700 text-left font-outfit-semibold text-3xl w-full`}
            >
              {formatToBRL(totalAmount)}
            </Text>
          </View>

          <View className={`gap-4 h-full`} style={{ height: 90 }}>
            <View
              className={`p-4 bg-[#101010] w-[320px]  flex flex-row items-center justify-between h-[68px] rounded-2xl mr-4`}
            >
              <View className={`flex flex-row w-1/2 gap-2 items-center`}>
                <IncomeIcon />
                <Text className={`text-[#ddd1d1] text-xl font-outfit-regular`}>
                  Entradas
                </Text>
              </View>
              <Text
                className={`text-[#fff] font-outfit-semibold w-1/2 text-right text-xl`}
              >
                {formatToBRL(incomes)}
              </Text>
            </View>
            <View
              className={`p-4 bg-[#101010] w-[320px] flex flex-row items-center justify-between h-[68px] rounded-2xl mr-4`}
            >
              <View className={`flex flex-row w-1/2 gap-2 items-center`}>
                <ExpensesIcon />
                <Text className={`text-[#ddd1d1] text-xl font-outfit-regular`}>
                  Saídas
                </Text>
              </View>
              <Text
                className={`text-[#FE0000] font-outfit-semibold w-1/2 text-right text-xl`}
              >
                - {formatToBRL(expenses)}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View
          className={`flex flex-row items-center justify-between w-full mt-4`}
        >
          <Text
            className={`${
              !isDark ? "text-black" : "text-white"
            } text-[20px] font-outfit-bold w-1/2 text-left pl-2`}
          >
            Transações
          </Text>
        </View>
        <Lista />
      </View>
    </SafeAreaView>
  );
}
