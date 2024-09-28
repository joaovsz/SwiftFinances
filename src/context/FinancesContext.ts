import { createContext, Dispatch, useContext } from "react";
import { Transaction } from "../models/transaction";

export type State = {
  reloaded: boolean;
  transaction: Transaction[];
  totalIncomes: number;
  totalExpenses: number;
  totalAmount: number;
};

export const initialState: State = {
  reloaded: false,
  transaction: [],
  totalIncomes: 0.0,
  totalExpenses: 0.0,
  totalAmount: 0,
};

export type FinancesContextType = {
  state: State;
  openAddTransactionModal: boolean;
  incomes: number;
  expenses: number;
  totalAmount: number;
  setTotalAmount: Dispatch<React.SetStateAction<number>>;
  reloadValues: () => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: number) => void;
  calculateIncomes: (amount: number) => void;
  calculateExpenses: (amount: number) => void;
  calculateTotal: () => void;
  setOpenAddTransactionModal: Dispatch<React.SetStateAction<boolean>>;
  minusTransaction: (transaction: any) => void;
};
const FinancesContext = createContext<FinancesContextType | undefined>(
  undefined
);

export default FinancesContext;

export const useFinances = () => {
  const context = useContext(FinancesContext);
  if (context === undefined) {
    throw new Error("useFinances must be used within a FinancesProvider");
  }
  return context;
};
