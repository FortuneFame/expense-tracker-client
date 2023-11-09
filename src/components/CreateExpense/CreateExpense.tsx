    import { FC, useState } from 'react';
    import { URL_API } from '../../constants/constantsApp';
    import { AccountType } from '../../types';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, FormHelperText, SelectChangeEvent } from '@mui/material';

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
        
    const handleAccountChange = (event: SelectChangeEvent<string>) => {
        const account = accounts.find(account => account.id.toString() === event.target.value);
        setAccountId(event.target.value);
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
                <TextField
                    label="Название расхода"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    fullWidth
                />
            </div>
            <div>
                <TextField
                    label="Сумма"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    fullWidth
                />
            </div>
            <div>
                <FormControl fullWidth required>
                    <InputLabel>Счет</InputLabel>
                    <Select
                        value={accountId}
                        onChange={handleAccountChange}
                        label="Счет"
                    >
                        <MenuItem value="" disabled>Выберите счет</MenuItem>
                        {accounts.map((account) => (
                            <MenuItem key={account.id} value={account.id}>
                                {account.name} (Баланс: {account.balance})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <Button type="submit" variant="contained" color="primary">
                Добавить расход
            </Button>
            {error && <FormHelperText error>{error}</FormHelperText>}
        </form>
    );
};

export default CreateExpense;
