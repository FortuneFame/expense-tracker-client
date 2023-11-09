import { FC } from 'react';

import useAuth from '../../Context/authContext';
import AccountsProvider from '../../Context/Provider/AccountsProvider';

import AccountCreate from '../../components/AccountCreate';
import Header from '../../components/Header/Header';
import AccountsList from '../../components/AccountsList';
import { useAccounts } from '../../hooks/useAccounts';
import { Typography } from '@mui/material';

const HomeContent: FC = () => {
    const authToken = useAuth();
    const { accounts } = useAccounts();

    return (
        <div>
            <Header />
            {accounts.length > 0 ? (
                <>
                </>
            ) : (
                <div>
                    <Typography textAlign='center' variant="h4" gutterBottom marginBlock='40px'>
                        Откройте финансовую свободу с помощью умного бюджетирования!
                    </Typography>
                    <Typography textAlign='center' variant="h6">Создайте бюджет, чтобы начать.</Typography>
                </div>
            )}
            <AccountCreate authToken={authToken} />
            <AccountsList authToken={authToken} />
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
