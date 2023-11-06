import { FC, useEffect, useState } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { AccountType } from '../../types';

interface ExpenseProps {
  authToken: string;
  onExpenseAdded: () => void;
  accounts: AccountType[];
}

const Expense: FC<ExpenseProps> = ({ authToken, onExpenseAdded, accounts }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState('');
    const [error, setError] = useState<string | null>(null);

useEffect(() => {
    async function loadAccounts() {
        try {
            const response = await fetch(`${URL_API}/account`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
        
            if (response.ok) {
                const data = await response.json();
                if (!data.status || !Array.isArray(data.data)) {
                    console.error('Полученные данные не являются массивом или некорректный формат:', data);
                }
            } else {
                throw new Error('Ошибка при загрузке счетов');
            }

        } catch (error) {
            console.error(error);
        }
    }

    loadAccounts();
}, [authToken]);

    
    const handleCreateExpense = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch(`${URL_API}/expense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    description,
                    expense: Number(amount),
                    account_id: Number(accountId),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при создании расхода');
            }

            setDescription('');
            setAmount('');
            setAccountId('');
            onExpenseAdded();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла ошибка при создании расхода');
            }
        }
    };

    return (
        <form onSubmit={handleCreateExpense}>
            <h2>Добавление расхода</h2>
            <div>
                <label>Название расхода</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Сумма</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Счет</label>
                <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    required
                >
                    <option value="" disabled>Выберите счет</option>
                   {accounts.map((account: AccountType) => (
                        <option key={account.id} value={account.id}>
                            {account.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Добавить расход</button>
            {error && <p className="error">{error}</p>}
        </form>
    );
};
export default Expense;
