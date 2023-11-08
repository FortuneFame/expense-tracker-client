import { FC, useState } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { AccountType } from '../../types';

interface IncomeProps {
  authToken: string;
  onIncomeAdded: () => void;
  accounts: AccountType[];
}

const Income: FC<IncomeProps> = ({ authToken, accounts, onIncomeAdded }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAccountId(e.target.value);
    };

    const handleCreateIncome = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch(`${URL_API}/income`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    description,
                    income: Number(amount),
                    account_id: Number(accountId),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при создании дохода');
            }

            setDescription('');
            setAmount('');
            setAccountId('');
            setError(null);
            onIncomeAdded();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла ошибка при создании дохода');
            }
        }
    };

    return (
        <form onSubmit={handleCreateIncome}>
            <h2>Добавление дохода</h2>
            <div>
                <label>Описание дохода</label>
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
                    onChange={handleAccountChange}
                    required
                >
                    <option value="" disabled>Выберите счет</option>
                    {accounts.map((account: AccountType) => (
                        <option key={account.id} value={account.id}>
                            {account.name} (Баланс: {account.balance})
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Добавить доход</button>
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default Income;
