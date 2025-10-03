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
          className={`ml-2 ${
            !isDark ? "text-slate-600" : "text-white"
          } text-left`}
          style={{
            fontFamily: 'AlanSans-Regular',
            fontSize: 24,
            lineHeight: 32,
            paddingVertical: 4,
          }}
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
          className="flex-row gap-4 max-h-[160px]"
        >
          {/* Card Principal - Saldo */}
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              padding: 20,
              width: 280,
              marginRight: 16,
              
              shadowRadius: 8,
              justifyContent: 'space-around',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, }}>
              <TotalIcon color={theme.colors.text} />
              <Text 
                style={{ 
                  color: theme.colors.text,
                  fontFamily: 'AlanSans-Regular',
                  fontSize: 28,
                  lineHeight: 36,
                  paddingVertical: 2
                }}
              >
                Saldo
              </Text>
            </View>
            <Text 
              style={{ 
                color: theme.colors.primary,
                fontFamily: 'AlanSans-ExtraBold',
                fontSize: 33,
                lineHeight: 40,
                paddingVertical: 2
              }}
            >
              {formatToBRL(totalAmount)}
            </Text>
          </View>

          <View style={{ gap: 16, height: 90 }}>
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 16,
                padding: 16,
                width: 280,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                <IncomeIcon />
                <Text 
                  style={{ 
                    color: theme.colors.text,
                    fontFamily: 'AlanSans-SemiBold',
                    fontSize: 18,
                    lineHeight: 24,
                    paddingVertical: 2
                  }}
                >
                  Entradas
                </Text>
              </View>
              <Text
                style={{ 
                  color: isDark ? '#22c55e' : '#16a34a',
                  fontFamily: 'AlanSans-Bold',
                  fontSize: 18,
                  lineHeight: 24,
                  paddingVertical: 2
                }}
              >
                {formatToBRL(incomes)}
              </Text>
            </View>
            
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 16,
                padding: 16,
                width: 280,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                elevation: isDark ? 3 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.2 : 0.05,
                shadowRadius: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                <ExpensesIcon />
                <Text 
                  style={{ 
                    color: theme.colors.text,
                    fontFamily: 'AlanSans-SemiBold',
                    fontSize: 18,
                    lineHeight: 24,
                    paddingVertical: 2
                  }}
                >
                  Saídas
                </Text>
              </View>
              <Text 
                style={{ 
                  color: isDark ? '#ef4444' : '#dc2626',
                  fontFamily: 'AlanSans-Bold',
                  fontSize: 18,
                  lineHeight: 24,
                  paddingVertical: 2
                }}
              >
                - {formatToBRL(expenses)}
              </Text>
            </View>
          </View>
        </ScrollView>
        
        <View className="flex flex-row items-center justify-between w-full ml-2">
          <Text
            className={`${
              !isDark ? "text-slate-600" : "text-white"
            } text-left`}
            style={{
              fontFamily: 'AlanSans-Bold',
              fontSize: 20,
              lineHeight: 28,
              paddingVertical: 4,
            }}
          >
            Transações Recentes
          </Text>
        </View>
        <Lista />
      </View>
    </SafeAreaView>
  );
}
