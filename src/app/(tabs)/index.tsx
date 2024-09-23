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

export default function Home() {
  const { totalAmount, state, incomes, expenses, calculateIncomes } =
    useFinances();

  useEffect(() => {
    calculateIncomes(state.totalIncomes);
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#1E1E1E",
        flex: 1,
      }}
    >
      {<TransactionModal />}
      <View className={`h-auto w-full py-4 gap-4 px-3 `}>
        <HeaderUser />
        <Text
          className={`text-white font-outfit-light font-outfit-medium text-[20px] text-left pl-6 `}
        >
          Resumo
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flexDirection: "row",
            height: 150,
          }}
          className={`flex-row gap-4 h-[150px]`}
        >
          <View
            className={`p-4 rounded-2xl bg-[#101010] w-[320px] mr-4 gap-4 justify-evenly `}
          >
            <View className={`flex flex-row gap-4 items-center `}>
              <IncomeIcon />
              <Text className={`text-white font-outfit-regular flex-1 text-xl`}>
                Entradas
              </Text>
            </View>
            <Text className={`text-white font-outfit-bold text-3xl`}>
              {formatToBRL(incomes)}
            </Text>
          </View>
          <View className={`gap-4 h-full `}>
            <View
              className={`p-4 bg-[#101010]  flex flex-row items-center justify-between h-[66px] rounded-2xl mr-4`}
            >
              <View className={`flex flex-row gap-2 items-center`}>
                <ExpensesIcon />
                <Text className={`text-[#fff] text-xl font-outfit-regular`}>
                  Saídas
                </Text>
              </View>
              <Text className={`text-[#FE0000] font-outfit-semibold text-xl`}>
                - {formatToBRL(expenses)}
              </Text>
            </View>
            <View
              className={`p-4 bg-[#101010] w-[320px] flex flex-row items-center justify-between h-[66px] rounded-2xl mr-4`}
            >
              <View className={`flex flex-row gap-2 items-center`}>
                <TotalIcon />
                <Text
                  className={`text-[#fff] font-outfit-regular w-1/2 text-xl`}
                >
                  Saldo
                </Text>
              </View>
              <Text
                className={`text-green-700 font-outfit-semibold text-xl w-1/2`}
              >
                {formatToBRL(totalAmount)}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View
          className={`flex flex-row items-center justify-between w-full mt-4`}
        >
          <Text
            className={`text-white text-[20px] font-outfit-bold w-1/2 text-left pl-2`}
          >
            Transações
          </Text>
          {/* <Button
            className={`rounded-[32px] w-1/2 h-fit bg-[#80AF81]`}
          >
            <View className={`flex flex-row justify-center items-center `}>
              <PlusCircleIcon size={20} color={"#fff"} />
              <Text className={`text-white text-center ml-2 font-outfit-medium`}>
                Incluir Transação
              </Text>
            </View>
          </Button> */}
        </View>
        <Lista />
      </View>
    </SafeAreaView>
  );
}
