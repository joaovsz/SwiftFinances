export type Transaction = {
  id: number;
  label: string;
  value: number;
  date: string;
  type: number;
  category?: string;
  isAutomatic?: boolean;
  merchant?: string;
  transactionType?: 'debit' | 'credit' | 'pix' | 'purchase';
};
