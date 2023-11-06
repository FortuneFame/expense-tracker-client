import { FC, useEffect, useState } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountType, PropsAccountsList } from '../../types';

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
        try {
            const response = await fetch(`${URL_API}/account/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
        
            if (!response.ok) {
                throw new Error('Ошибка при удалении счета');
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

    
    return (
        <div>
            <h2>Accounts List</h2>
            {Array.isArray(accounts) && accounts.map(account => {
                const isEditing = editingStates[account.id] || false;

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
                            </>
                        ) : (
                            <>
                                <h3>{account.name}</h3>
                                <p>Баланс: {account.balance}</p>
                                <button onClick={() => setEditingStates(prev => ({ ...prev, [account.id]: true }))}>Редактировать название</button>
                                <button onClick={() => handleDeleteAccount(account.id)}>Удалить счет</button>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AccountsList;