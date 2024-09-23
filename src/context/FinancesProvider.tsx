import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Transaction } from "../types/transaction";
import FinancesContext, {
  FinancesContextType,
  State,
  initialState,
} from "./FinancesContext";
import * as SQLite from "expo-sqlite";

export const FinancesProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<State>(initialState);
  const [incomes, setIncomes] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [openAddTransactionModal, setOpenAddTransactionModal] = useState(false);
  useEffect(() => {
    const createDB = async () => {
      try {
        const db = await SQLite.openDatabaseAsync("transactions");
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS transactions
          (id INTEGER PRIMARY KEY NOT NULL, label TEXT NOT NULL, value REAL NOT NULL, 
          type REAL NOT NULL,
          created_at TEXT NOT NULL)`);
        return (await db.getAllAsync(
          "SELECT * FROM transactions"
        )) as Transaction[];
      } catch (err) {
        console.log(err);
        return [];
      }
    };
    createDB().then((res) => {
      setState((prev) => ({ ...prev, transaction: res }));
    });
  }, []);

  useEffect(() => {
    const newIncomes = state.transaction
      .filter((transaction) => transaction.type === 1)
      .reduce((acc, transaction) => acc + transaction.value, 0);

    const newExpenses = state.transaction
      .filter((transaction) => transaction.type !== 1)
      .reduce((acc, transaction) => acc + transaction.value, 0);
    const total = newIncomes - newExpenses;
    setTotalAmount(total);
    setIncomes(newIncomes);
    setExpenses(newExpenses);
  }, [state.transaction, minusTransaction]);

  const reloadValues = () => {
    setState((prev) => ({ ...prev, reloaded: false }));
  };

  const addTransaction = async (transaction: Transaction) => {
    setState((prev) => ({
      ...prev,
      transaction: [...prev.transaction, transaction],
    }));
  };

  const removeTransaction = async (id: number) => {
    const db = await SQLite.openDatabaseAsync("transactions");
    await db.execAsync(`DELETE FROM transactions WHERE id = ${id}`);
    setState((prev) => ({
      ...prev,
      transaction: prev.transaction.filter((t) => t.id !== id),
    }));
  };

  const calculateIncomes = (amount: number) => {
    setState((prev) => ({
      ...prev,
      totalIncomes: prev.totalIncomes + amount,
    }));
  };

  const calculateExpenses = (amount: number) => {
    setState((prev) => ({
      ...prev,
      totalExpenses: prev.totalExpenses + amount,
    }));
  };

  const calculateTotal = () => {
    setState((prev) => ({
      ...prev,
      totalAmount: prev.totalIncomes - prev.totalExpenses,
    }));
  };

  function minusTransaction(transaction: any) {
    setState((prev) => {
      if (transaction.type === 1) {
        return {
          ...prev,
          totalIncomes: prev.totalIncomes - transaction.value,
          totalAmount: prev.totalIncomes - prev.totalExpenses,
        };
      } else {
        return {
          ...prev,
          totalExpenses: prev.totalExpenses - transaction.value,
          totalAmount: prev.totalIncomes - prev.totalExpenses,
        };
      }
    });
  }

  return (
    <FinancesContext.Provider
      value={{
        state,
        totalAmount,
        openAddTransactionModal,
        incomes,
        expenses,
        setTotalAmount,
        setOpenAddTransactionModal,
        reloadValues,
        addTransaction,
        removeTransaction,
        calculateIncomes,
        calculateExpenses,
        calculateTotal,
        minusTransaction,
      }}
    >
      {children}
    </FinancesContext.Provider>
  );
};
