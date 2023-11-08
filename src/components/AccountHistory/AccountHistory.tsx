import { useState, useEffect, FC } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { AccountHistoryProps, AccountSummaryResponse, TransactionsResponse } from '../../types';

export type TransactionType = 'income' | 'expense';

const AccountHistory: FC<AccountHistoryProps> = ({ authToken, account, refreshTrigger, setAccounts, setRefreshTrigger }) => {
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${URL_API}/account/${account.id}/summary`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Ошибка при получении истории транзакций');
        }
        const responseData: AccountSummaryResponse = await response.json();
        setTransactions(responseData.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    };

    if (authToken && account) {
      fetchTransactions();
    }
  }, [authToken, account, refreshTrigger]);

  const deleteTransaction = async (type: TransactionType, transactionId: number) => {
    try {
      
      const endpoint = type === 'income' ? `/income/${transactionId}` : `/expense/${transactionId}`;
      const response = await fetch(`${URL_API}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка при удалении ${type === 'income' ? 'дохода' : 'расхода'}`);
      }

      // Если удаление прошло успешно, обновляем список транзакций
      setRefreshTrigger((prev: boolean) => !prev);

      // Обновляем баланс счета в состоянии
      const transaction = transactions && (type === 'income'
        ? transactions.incomes.find(t => t.id === transactionId)
        : transactions.expenses.find(t => t.id === transactionId));
      
      const amount = transaction ? transaction.amount : 0;

      const updatedAccount = {
        ...account,
        balance: type === 'income' ? account.balance + amount : account.balance + amount
      };
      setAccounts((prevAccounts) => prevAccounts.map(acc => acc.id === account.id ? updatedAccount : acc));
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Неизвестная ошибка");
      }
    }
  }

  if (loading) return <p>Загрузка истории транзакций...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h3>История транзакций для счета {account.name}</h3>
      {!loading && !error && transactions && (
        <>
          <h4>Доходы</h4>
          <ul>
            {transactions.incomes.map((income) => (
              <li key={income.id}>
                {income.description} - {income.amount} (Дата: {new Date(income.createdAt).toLocaleDateString()})
                <button onClick={() => deleteTransaction('income', income.id)}>Удалить</button>
              </li>
            ))}
          </ul>
          <h4>Расходы</h4>
          <ul>
            {transactions.expenses.map((expense) => (
              <li key={expense.id}>
                {expense.description} - {expense.amount} (Дата: {new Date(expense.createdAt).toLocaleDateString()})
                <button onClick={() => deleteTransaction('expense', expense.id)}>Удалить</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AccountHistory;