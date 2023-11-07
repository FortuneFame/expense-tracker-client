import { FC, useEffect, useState } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountType, PropsAccountsList } from '../../types';
import Expense from '../Expense/Expense';
import Income from '../Income';

const fetchAccounts = async(authToken: string): Promise<{ data: AccountType[] }> => {
    const response = await fetch(`${URL_API}/account`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Ошибка при получении данных');
    }
    return await response.json();
    
}

const AccountsList: FC<PropsAccountsList> = ({ authToken }) => {
    const { accounts, setAccounts, refreshTrigger, setRefreshTrigger } = useAccounts();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingStates, setEditingStates] = useState<Record<number, boolean>>({});
    const [editedNames, setEditedNames] = useState<Record<number, string>>({});
    const [deletingAccount, setDeletingAccount] = useState<number | null>(null);

    useEffect(() => {
        if (authToken) {
            fetchAccounts(authToken)
                .then(response => {
                    setAccounts(response.data);
                    setRefreshTrigger(false);
                    setLoading(false);
                })
                .catch((err: unknown) => {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Неизвестная ошибка");
                    }
                    setLoading(false);
                });
        }
    }, [authToken, refreshTrigger, setAccounts, setRefreshTrigger]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error as string}</p>;
        
    const handleEditAccountName = async (id: number, name: string) => {
        
        try {
            const response = await fetch(`${URL_API}/account/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ name })
            });
            
            if (!response.ok) {
                throw new Error('Ошибка при обновлении имени счета');
            }
            
            setRefreshTrigger(!refreshTrigger);
            
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Неизвестная ошибка");
            }
        }
    };

    const handleDeleteAccount = async (id: number) => {
        const previousAccounts = accounts;

        const newAccounts = accounts.filter(account => account.id !== id);
        setAccounts(newAccounts);

        try {
            const response = await fetch(`${URL_API}/account/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                setAccounts(previousAccounts);
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при удалении счета');
            }

        } catch (error) {
            setAccounts(previousAccounts);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Неизвестная ошибка");
            }
        } finally {
            setDeletingAccount(null);
        }
    };

    return (
        <div>
            {accounts.length > 0 && <h2>Существующие бюджеты</h2>}
            {Array.isArray(accounts) && accounts.map(account => {
                const isEditing = editingStates[account.id] || false;
                const createdAt = new Date(account.createdAt).toLocaleString();
                const updatedAt = new Date(account.updatedAt).toLocaleString();

                return (
                    <div key={account.id} className="account-card">
                        {isEditing ? (
                            <>
                                <input
                                    value={editedNames[account.id] || account.name}
                                    onChange={(e) => setEditedNames(prev => ({ ...prev, [account.id]: e.target.value }))}
                                />
                                <button onClick={() => {
                                    handleEditAccountName(account.id, editedNames[account.id] || account.name);
                                    setEditingStates(prev => ({ ...prev, [account.id]: false }));
                                }}>
                                    Сохранить
                                </button>
                                <button onClick={() => {
                                    setEditingStates(prev => ({ ...prev, [account.id]: false }));
                                    setEditedNames(prev => ({ ...prev, [account.id]: account.name }));
                                }}>
                                    Отмена
                                </button>

                            </>
                        ) : (
                            <>
                                <h3>{account.name}</h3>
                                <p>Баланс: {account.balance}</p>
                                <p>Дата создания: {createdAt}</p>
                                <p>Последнее изменение: {updatedAt}</p>
                                <button onClick={() => setEditingStates(prev => ({ ...prev, [account.id]: true }))}>Редактировать название</button>
                                <button
                                    onClick={() => handleDeleteAccount(account.id)}
                                    disabled={deletingAccount === account.id}
                                >
                                    Удалить счет
                                </button>
                            </>
                        )}
                    </div>
                );
            })}
            {authToken && accounts.length > 0 &&
                <Expense authToken={authToken} onExpenseAdded={() => setRefreshTrigger(!refreshTrigger)} accounts={accounts} />
            }
            {authToken && <Income authToken={authToken} onIncomeAdded={() => setRefreshTrigger(!refreshTrigger)} accounts={accounts} />}
        </div>
    );
};

export default AccountsList;