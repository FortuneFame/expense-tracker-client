import { FC } from 'react';

import useAuth from '../../Context/authContext';
import AccountsProvider from '../../Context/Provider/AccountsProvider';

import Account from '../../components/Account';
import Header from '../../components/Header/Header';
import AccountsList from '../../components/AccountsList';
import { useAccounts } from '../../hooks/useAccounts';
// import Expense from '../../components/Expense/Expense';

const HomeContent: FC = () => {
    const authToken = useAuth();
    const { accounts } = useAccounts();

    return (
        <div>
            <Header />
            <Account authToken={authToken} />
            <AccountsList authToken={authToken} />
            {accounts.length > 0 ? (
                <>
                </>
            ) : (
                <div>
                    <h2>Откройте финансовую свободу с помощью умного бюджетирования!</h2>
                    <p>Создайте бюджет, чтобы начать.</p>
                </div>
            )}
        </div>
    );
};


const Home: FC = () => {
    return (
        <AccountsProvider>
            <HomeContent/>
        </AccountsProvider>
    );
};

export default Home;