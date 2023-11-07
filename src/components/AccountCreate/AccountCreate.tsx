import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountFormData } from '../../types';
import { URL_API } from '../../constants/constantsApp';

type PropsAccount = {
    authToken: string | null;
}

const Account: FC<PropsAccount> = ({ authToken }) => {
    const { accounts, setAccounts } = useAccounts();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);
    const focusRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.focus();
        }
    }, [accounts]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
     
        const formData: Omit<AccountFormData, 'id'> = {
            name: (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
            balance: parseFloat((e.currentTarget.elements.namedItem('balance') as HTMLInputElement).value),
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
            setAccounts([...accounts, responseData.data]);

      
            formRef.current?.reset();
            console.log('Отправляемые данные:', formData);

            setIsSubmitting(false);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    
    return (
        <div>
            <h2>Создать бюджет</h2>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div>
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
                <div>
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
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span>Отправка...</span>
                    ) : (
                        <span>Создать бюджет</span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default Account;
