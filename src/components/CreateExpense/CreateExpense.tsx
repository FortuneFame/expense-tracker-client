import { FC, useState } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { AccountType } from '../../types';

interface ExpenseProps {
  authToken: string;
  onExpenseAdded: () => void;
  accounts: AccountType[];
}

const CreateExpense: FC<ExpenseProps> = ({ authToken, accounts, onExpenseAdded }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(null);
    
    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const account = accounts.find(account => account.id.toString() === e.target.value);
        setAccountId(e.target.value);
        setSelectedAccount(account || null);
    };

    const handleCreateExpense = async (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedAccount && Number(amount) > selectedAccount.balance) {
            setError('На счету недостаточно средств для данной операции');
            return;
        }
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
            setError(null);
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
            <button type="submit">Добавить расход</button>
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default CreateExpense;
