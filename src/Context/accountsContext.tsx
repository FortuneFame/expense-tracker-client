import React from 'react';
import { AccountsContextType } from '../types';

const AccountsContext = React.createContext<AccountsContextType | undefined>(undefined);

export default AccountsContext;