import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Platform } from "react-native";
import { Transaction } from "../models/transaction";
import FinancesContext, {
  FinancesContextType,
  State,
  initialState,
} from "./FinancesContext";

// Conditional import for SQLite
let SQLite: any = null;
if (Platform.OS !== 'web') {
  SQLite = require('expo-sqlite');
}

export const FinancesProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<State>(initialState);
  const [db, setDb] = useState<any>(null);
  const [incomes, setIncomes] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [openAddTransactionModal, setOpenAddTransactionModal] = useState(false);
  
  useEffect(() => {
    const createDB = async () => {
      if (Platform.OS === 'web') {
        // For web, use localStorage as fallback
        const existingData = localStorage.getItem('transactions');
        const transactions = existingData ? JSON.parse(existingData) : [];
        setState((prev) => ({ ...prev, transaction: transactions }));
        return transactions;
      } else {
        // For mobile, use SQLite
        const db = await SQLite.openDatabaseAsync("transactions", {
          useNewConnection: true,
        });
        setDb(db);
        try {
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS transactions
            (id INTEGER PRIMARY KEY NOT NULL, label TEXT NOT NULL, value REAL NOT NULL, 
            type REAL NOT NULL,
            created_at TEXT NOT NULL)`);
          return db.getAllAsync("SELECT * FROM transactions").then((res: any) => {
            return res as Transaction[];
          });
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    };
    
    const fetchTransactions = async () => {
      const res = await createDB();
      if (res && Platform.OS !== 'web') {
        setState((prev) => ({ ...prev, transaction: res }));
      }
    };
    fetchTransactions();
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
    
    // Save to localStorage on web
    if (Platform.OS === 'web') {
      const updatedTransactions = [...state.transaction, transaction];
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    }
  };

  const removeTransaction = async (id: number) => {
    if (Platform.OS === 'web') {
      // For web, update localStorage
      const updatedTransactions = state.transaction.filter((t) => t.id !== id);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    } else {
      // For mobile, use SQLite
      const db = await SQLite.openDatabaseAsync("transactions", {
        useNewConnection: true,
      });
      await db.execAsync(`DELETE FROM transactions WHERE id = ${id}`);
    }
    
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
        db,
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
