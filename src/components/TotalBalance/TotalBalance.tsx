import { FC, useEffect, useState } from 'react';
import { TotalBalanceProps } from '../../types';
import { Typography } from '@mui/material';


const TotalBalance: FC<TotalBalanceProps> = ({ accounts }) => {
    const [totalBalance, setTotalBalance] = useState<number>(0);

    useEffect(() => {
        const calculatedTotalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);
        setTotalBalance(calculatedTotalBalance);
    }, [accounts]);

    return (
        <div>
            <Typography textAlign='center' variant="h6">Общий баланс:</Typography>
            <Typography textAlign='center' variant="h4">{totalBalance}</Typography>

        </div>
    );
}

export default TotalBalance;

