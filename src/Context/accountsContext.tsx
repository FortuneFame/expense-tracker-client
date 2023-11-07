import { createContext } from 'react';
import { AccountsContextType } from '../types';

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export default AccountsContext;