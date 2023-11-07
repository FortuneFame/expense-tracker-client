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

