// import { FC, useEffect, useState } from 'react';
// import { URL_API } from '../../constants/constantsApp';
// import { TotalBalanceProps } from '../../types';

// const TotalBalance: FC<TotalBalanceProps> = ({ authToken, refreshTrigger, accounts }) => {
//     const [totalBalance, setTotalBalance] = useState<number | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);

//      console.log("Выполняется запрос к API. Значения зависимостей:");
//         // console.log("authToken:", authToken);
//         console.log("refreshTrigger:", refreshTrigger);
//         // console.log("accounts:", accounts);

//     useEffect(() => {
//         fetch(`${URL_API}/balance`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${authToken}`
//             }
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     console.log('Счета не найдены');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 if (data.status && data.data && typeof data.data.totalBalance === 'number') {
//                     setTotalBalance(data.data.totalBalance);
//                     console.log("Total balance set to:", data.data.totalBalance);
//                 }
//                 setLoading(false);
//             })

//         .catch(error => {
//             console.error("Ошибка при получении баланса:", error);
//             setLoading(false);
//         });
//     }, [authToken, refreshTrigger, accounts]);

//     if (loading) {
//         return <p>Загрузка...</p>;
//     }

//      if (totalBalance === null) {
//         return <p>Счета не найдены</p>;
//     }

//     return (
//         <div>
//             <h2>Общий баланс</h2>
//             {totalBalance !== null && <p>{totalBalance}</p>}
//         </div>
//     );
// }

// export default TotalBalance;

import { FC, useEffect, useState } from 'react';
import { TotalBalanceProps } from '../../types';


const TotalBalance: FC<TotalBalanceProps> = ({ accounts }) => {
    const [totalBalance, setTotalBalance] = useState<number>(0);

    useEffect(() => {
        const calculatedTotalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);
        setTotalBalance(calculatedTotalBalance);
    }, [accounts]);

    return (
        <div>
            <h2>Общий баланс</h2>
            <p>{totalBalance}</p>
        </div>
    );
}

export default TotalBalance;

