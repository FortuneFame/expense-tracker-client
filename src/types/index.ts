import { Dispatch, ReactNode, SetStateAction } from "react";

export interface AccountsContextType {
  accounts: AccountType[];
  refreshTrigger: boolean;
  setAccounts: React.Dispatch<React.SetStateAction<AccountType[]>>;
    setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TotalBalanceProps {
     accounts: AccountType[];
     setAccounts: (accounts: AccountType[]) => void;
}


export interface FormValues {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface PropsAccount{
    children: ReactNode;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export type PrivateRouteProps = {
  children: ReactNode;
};

export type Props = {
    open: boolean;
    onClose: () => void;
    authToken: string | null;
}

export type UserData = {
    id: number;
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
}

export type UseUserActionsProps = {
    authToken: string | null;
    userData: UserData | null;
    setUserData: (data: UserData | null) => void;
    setIsEditing: (value: boolean) => void;
    setTempUserData: (data: UserData | null) => void;
    setShowPassword: (value: boolean) => void; 
    setDialogOpen: (value: boolean) => void;   
    setDialogAction: (value: 'logout' | 'delete' | 'save' | null) => void; 
    setIsChangingPassword:(value: boolean) => void;
}

export type AccountType = {
    id: number;
    name: string;
    balance: number;
    createdAt: string; 
  updatedAt: string; 
    expenses: Expense[];
}

export type AccountFormData = {
  name: string;
  balance: number;
};


export type ValidationErrors = {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export type PropsAccountsList = {
    authToken: string | null;
}


export type ExpenseType = {
    id: number;
    description: string;
    amount: number;
};

export interface TransactionData {
  id: string;
  date: string;
  description: string;
  amount: number; 
  type: 'income' | 'expense'; 
}

export interface AccountReference {
  id: number;
  name: string;
}

export interface Income {
  id: number;
  description: string;
  amount: number;
  createdAt: Date;
  account: AccountReference;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  createdAt: Date;
  account: AccountReference;
  previousAmount?: number;
}
  
  export interface AccountHistoryProps {
  authToken: string | null;
    account: AccountType;
 refreshTrigger: boolean; 
  setAccounts: Dispatch<SetStateAction<AccountType[]>>;
  setRefreshTrigger: Dispatch<SetStateAction<boolean>>; 
  }
export interface Account {
  id: number;
  name: string;
}

export interface EditIncomeProps {
  income: Income;
  authToken: string | null;
  onIncomeUpdated: (updatedIncome: Income) => void; 
}
export interface EditExpenseProps {
  expense: Expense;
  authToken: string | null;
  onExpenseUpdated: (updatedExpense: Expense) => void;
}

export interface DeleteIncomeProps {
  incomeId: number;
  authToken:  string | null;
  onIncomeDeleted: (incomeId: number) => void;
}
export interface DeleteExpenseProps {
  expenseId: number;
  authToken:  string | null;
  onExpenseDeleted: (incomeId: number) => void;
}

export type TransactionType = 'income' | 'expense'; 
export interface Transaction {
  id: number;
  description: string;
  createdAt: string;
  account: Account;
  amount: number;
  type: TransactionType;
}

export interface TransactionsResponse {
  incomes: Income[];
  expenses: Expense[];
}

export interface AccountSummaryResponse {
  status: boolean;
  message: string;
  data: TransactionsResponse;
}


