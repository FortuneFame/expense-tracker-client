import React, { FC, useEffect, useRef, useState } from 'react';

import { useFetcher } from 'react-router-dom';
import { URL_API } from '../../constants/constantsApp';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountType } from '../../types';

type PropsAccount = {
    authToken: string | null;
}

const Account: FC<PropsAccount> = ({ authToken }) => {
    const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
    const { accounts, setAccounts } = useAccounts();
    
    const fetcher = useFetcher();
    const isSubmitting = fetcher.state === "submitting";

    const formRef = useRef<HTMLFormElement>(null);
    const focusRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (formRef.current) {
            formRef.current.reset();
        }

        if (focusRef.current) {
            focusRef.current.focus();
        }
    }, [isSubmitting]);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: Omit<AccountType, 'id'> = {
            name: (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
            balance: parseFloat((e.currentTarget.elements.namedItem('balance') as HTMLInputElement).value)
        };

        try {
            const response = await fetch(`${URL_API}/account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Ошибка от сервера:', errorData);
                throw new Error('Ошибка при отправке данных');
            }

            const responseData = await response.json();
            const newAccounts = [...accounts, responseData.data];
            setAccounts(newAccounts);

            setRefreshTrigger(!refreshTrigger);
            console.log('Отправляемые данные:', formData);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    
    return (
    
        <div >
            <h2 className="h3">Создать бюджет</h2>
            <form onSubmit={handleSubmit} className="grid-sm">
                <div className="grid-xs">
                    <label htmlFor="name">Название бюджета</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Главный счет"
                        required
                        ref={focusRef}
                    />
                </div>
                <div className="grid-xs">
                    <label htmlFor="balance">Сумма</label>
                    <input
                        type="number"
                        step="0.01"
                        name="balance"
                        id="balance"
                        placeholder="35,000 грн"
                        required
                        inputMode="decimal"
                    />
                </div>
                <input type="hidden" name="_action" value="createBudget" />
                <button type="submit" className="btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span>Отправка...</span>
                    ) : (
                        <>
                            <span>Создать бюджет</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
};

export default Account;