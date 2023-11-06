import { ReactNode } from "react";

export interface AccountsContextType {
  accounts: AccountType[];
  setAccounts: (accounts: AccountType[]) => void;
 refreshTrigger: boolean;
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
}

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