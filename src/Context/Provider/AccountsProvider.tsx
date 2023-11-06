import { FC, useState } from "react";
import AccountsContext from "../accountsContext";
import { AccountType, PropsAccount } from "../../types";

const AccountsProvider: FC<PropsAccount> = ({ children }) => {
    const [accounts, setAccounts] = useState<AccountType[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  return (
    <AccountsContext.Provider value={{ accounts, setAccounts, refreshTrigger, setRefreshTrigger }}>
      {children}
    </AccountsContext.Provider>
  );
};

export default AccountsProvider;