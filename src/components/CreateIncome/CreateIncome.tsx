import { FC, useState } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { AccountType } from '../../types';
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';

interface IncomeProps {
  authToken: string;
  onIncomeAdded: () => void;
  accounts: AccountType[];
}

const CreateIncome: FC<IncomeProps> = ({ authToken, accounts, onIncomeAdded }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAccountChange = (event: SelectChangeEvent<string>) => {
        setAccountId(event.target.value);
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
                <TextField
                    label="Описание дохода"
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
                        {accounts.map((account: AccountType) => (
                            <MenuItem key={account.id} value={account.id}>
                                {account.name} (Баланс: {account.balance})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <Button type="submit" variant="contained" color="primary">
                Добавить доход
            </Button>
            {error && <FormHelperText error>{error}</FormHelperText>}
        </form>
    );
};

export default CreateIncome;
