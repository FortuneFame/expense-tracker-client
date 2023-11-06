import { FC } from 'react';

import useAuth from '../../Context/authContext';
import AccountsProvider from '../../Context/Provider/AccountsProvider';

import Account from '../../components/Account';
import Header from '../../components/Header/Header';
import AccountsList from '../../components/AccountsList';

const HomeContent: FC = () => {
    const authToken = useAuth();
    return (
        <div>
            <Header />
            <Account authToken={authToken} />
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