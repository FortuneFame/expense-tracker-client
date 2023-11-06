import { FC } from 'react';
import Header from '../../components/Header/Header';
import useAuth from '../../Context/authContext';
import Account from '../../components/Account';
import AccountsList from '../../components/AccountsList';
import AccountsProvider from '../../Context/Provider/AccountsProvider';

const Home: FC = () => {
    const authToken = useAuth();
    return (
        <div>
            <Header />
            <AccountsProvider>
                <Account authToken={authToken} />
                <AccountsList authToken={authToken}/>
            </AccountsProvider>
        </div>
    );
};

export default Home;