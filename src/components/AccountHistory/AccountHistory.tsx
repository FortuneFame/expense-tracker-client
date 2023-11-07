import { useState, useEffect, FC } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { AccountHistoryProps, AccountSummaryResponse, TransactionsResponse } from '../../types';

const AccountHistory: FC<AccountHistoryProps> = ({ authToken, account }) => {
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
  }, [authToken, account]);

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
              </li>
            ))}
          </ul>
          <h4>Расходы</h4>
          <ul>
            {transactions.expenses.map((expense) => (
              <li key={expense.id}>
                {expense.description} - {expense.amount} (Дата: {new Date(expense.createdAt).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AccountHistory;