import { FC } from 'react';

import useAuth from '../../Context/authContext';
import AccountsProvider from '../../Context/Provider/AccountsProvider';

import AccountCreate from '../../components/AccountCreate';
import Header from '../../components/Header/Header';
import AccountsList from '../../components/AccountsList';
import { useAccounts } from '../../hooks/useAccounts';
// import Transaction from '../../components/Transaction/Transaction';
// import Tracker from '../../components/Tracker';

const HomeContent: FC = () => {
    const authToken = useAuth();
    const { accounts } = useAccounts();

    return (
        <div>
            <Header />
            <AccountCreate authToken={authToken} />
            <AccountsList authToken={authToken} />
            {/* <Tracker authToken={authToken}/> */}
            {/* <Transaction authToken={authToken}/> */}
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

// import { FC } from 'react';

// import useAuth from '../../Context/authContext';
// import AccountsProvider from '../../Context/Provider/AccountsProvider';

// import AccountHistory from '../../components/AccountHistory';
// import Header from '../../components/Header/Header';
// import AccountsList from '../../components/AccountsList';
// import { useAccounts } from '../../hooks/useAccounts';
// import AccountCreate from '../../components/AccountCreate';


// const HomeContent: FC = () => {
//     const authToken = useAuth();
//     const { accounts } = useAccounts();

//     return (
//         <div>
//             <Header />
//             <AccountCreate authToken={authToken} />
//             <AccountsList authToken={authToken} />
//             {accounts.length > 0 ? (
//                 accounts.map((accountItem) => (
//                     <AccountHistory key={accountItem.id} account={accountItem} authToken={authToken}/>
//                 ))
//             ) : (
//                 <div>
//                     <h2>Откройте финансовую свободу с помощью умного бюджетирования!</h2>
//                     <p>Создайте бюджет, чтобы начать.</p>
//                 </div>
//             )}
//         </div>
//     );
// };


// const Home: FC = () => {
//     return (
//         <AccountsProvider>
//             <HomeContent/>
//         </AccountsProvider>
//     );
// };

// export default Home;