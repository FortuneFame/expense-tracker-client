import { FC, useMemo, useState } from "react";
import AccountsContext from "../accountsContext";
import { AccountType, PropsAccount } from "../../types";

const AccountsProvider: FC<PropsAccount> = ({ children }) => {
    const [accounts, setAccounts] = useState<AccountType[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  
  const value = useMemo(() => ({ accounts, setAccounts, refreshTrigger, setRefreshTrigger }), [accounts, refreshTrigger]);
  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
};

export default AccountsProvider;