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
import { NotificationService } from "../services/NotificationService";

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
            created_at TEXT NOT NULL,
            category TEXT DEFAULT 'Outros')`);
          
          // Adicionar coluna category se não existir (para bancos de dados existentes)
          try {
            await db.execAsync(`ALTER TABLE transactions ADD COLUMN category TEXT DEFAULT 'Outros'`);
          } catch (error) {
            // Coluna já existe, ignorar erro
          }
          
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

  // Setup NotificationService listener for automatic transactions
  useEffect(() => {
    const handleAutomaticTransaction = (transaction: Transaction) => {
      console.log('🎯 FinancesProvider: Recebeu transação automática:', transaction);
      try {
        addTransaction(transaction);
        console.log('✅ FinancesProvider: Transação adicionada com sucesso');
      } catch (error) {
        console.error('❌ FinancesProvider: Erro ao adicionar transação:', error);
      }
    };

    console.log('🔧 FinancesProvider: Configurando listener para NotificationService');
    NotificationService.addTransactionListener(handleAutomaticTransaction);

    return () => {
      console.log('🔧 FinancesProvider: Removendo listener do NotificationService');
      NotificationService.removeTransactionListener(handleAutomaticTransaction);
    };
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
    // Validar e sanitizar o valor da transação
    const sanitizedTransaction = {
      ...transaction,
      value: typeof transaction.value === 'number' && !isNaN(transaction.value) 
        ? transaction.value 
        : 0
    };
    
    console.log('💾 Salvando transação:', sanitizedTransaction);
    
    if (Platform.OS === 'web') {
      // Save to localStorage on web
      const updatedTransactions = [...state.transaction, sanitizedTransaction];
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setState((prev) => ({
        ...prev,
        transaction: updatedTransactions,
      }));
    } else {
      // Save to SQLite on mobile
      if (db) {
        try {
          await db.runAsync(
            `INSERT INTO transactions (id, label, value, type, created_at, category) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              sanitizedTransaction.id,
              sanitizedTransaction.label,
              sanitizedTransaction.value,
              sanitizedTransaction.type,
              sanitizedTransaction.date || new Date().toISOString(),
              sanitizedTransaction.category || 'Outros'
            ]
          );
          console.log('✅ Transação salva no SQLite');
        } catch (error) {
          console.error('❌ Erro ao salvar no SQLite:', error);
        }
      }
      
      // Update state
      setState((prev) => ({
        ...prev,
        transaction: [...prev.transaction, sanitizedTransaction],
      }));
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

  const updateTransaction = async (updatedTransaction: Transaction) => {
    console.log('🔄 Atualizando transação:', updatedTransaction);
    
    if (Platform.OS === 'web') {
      // For web, update localStorage
      const updatedTransactions = state.transaction.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    } else {
      // For mobile, use SQLite
      if (db) {
        try {
          await db.runAsync(
            `UPDATE transactions SET label = ?, value = ?, category = ? WHERE id = ?`,
            [
              updatedTransaction.label,
              updatedTransaction.value,
              updatedTransaction.category || 'Outros',
              updatedTransaction.id
            ]
          );
          console.log('✅ Transação atualizada no SQLite');
        } catch (error) {
          console.error('❌ Erro ao atualizar no SQLite:', error);
          throw error;
        }
      }
    }
    
    // Update state
    setState((prev) => ({
      ...prev,
      transaction: prev.transaction.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      ),
    }));

    console.log('✅ FinancesProvider: Transação atualizada com sucesso');
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
      // Garantir que temos um valor válido
      const amount = transaction.value || transaction.amount || 0;
      
      if (transaction.type === 1) {
        return {
          ...prev,
          totalIncomes: Math.max(0, prev.totalIncomes - amount),
          totalAmount: prev.totalIncomes - prev.totalExpenses,
        };
      } else {
        return {
          ...prev,
          totalExpenses: Math.max(0, prev.totalExpenses - amount),
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
        updateTransaction,
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
