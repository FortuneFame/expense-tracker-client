import { useState, useEffect, FC } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { AccountHistoryProps, AccountSummaryResponse, Expense, Income, TransactionsResponse } from '../../types';
import EditIncome from '../EditIncome';
import DeleteIncome from '../DeleteIncome';
import EditExpense from '../EditExpense';
import DeleteExpense from '../DeleteExpense';
import { useAccounts } from '../../hooks/useAccounts';

const AccountHistory: FC<AccountHistoryProps> = ({ authToken, account, refreshTrigger }) => {
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { setAccounts, setRefreshTrigger } = useAccounts();

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

  const handleIncomeUpdate = (updatedIncome: Income) => {
    setTransactions((prevTransactions) => {
      if (!prevTransactions) return null;
      const updatedIncomes = prevTransactions.incomes.map((income) =>
        income.id === updatedIncome.id ? { ...income, ...updatedIncome } : income
      );
      return { ...prevTransactions, incomes: updatedIncomes };
    });
  };

  const handleIncomeDelete = (incomeId: number) => {
    setTransactions((prevTransactions) => {
      if (!prevTransactions) return null;
      const updatedIncomes = prevTransactions.incomes.filter((income) => income.id !== incomeId);
      return { ...prevTransactions, incomes: updatedIncomes };
    });
  };

  const handleExpenseDelete = (expenseId: number) => {
    setTransactions((prevTransactions) => {
      if (!prevTransactions) return null;
      const updatedExpenses = prevTransactions.expenses.filter((expense) => expense.id !== expenseId);
      return { ...prevTransactions, expenses: updatedExpenses };
    });
  };
  
  // const handleExpenseUpdate = (updatedExpense: Expense) => {
  //   if (!updatedExpense.account) {
  //     console.error('Updated expense does not have an associated account.');
  //     return;
  //   } if (!updatedExpense || !updatedExpense.account || typeof updatedExpense.previousAmount !== 'number') {
  //     console.error('Invalid expense data');
  //     return;
  //   }
  //   setTransactions((prevTransactions) => {
  //     if (!prevTransactions) return null;
  //     const updatedExpenses = prevTransactions.expenses.map((expense) =>
  //       expense.id === updatedExpense.id ? { ...expense, ...updatedExpense } : expense
  //     );
  //     return { ...prevTransactions, expenses: updatedExpenses };
  //   });

  //   setAccounts((prevAccounts: AccountType[]) => {
  //     return prevAccounts.map((acc: AccountType) => {
  //       if (acc.id === updatedExpense.account.id) {
  //         const oldExpenseAmount = updatedExpense.previousAmount || 0;
  //         const balanceDifference = updatedExpense.amount - oldExpenseAmount;
  //         const newBalance = acc.balance - balanceDifference;
  //         return { ...acc, balance: newBalance };
  //       }
  //       return acc;
  //     });
  //   });
  //   setRefreshTrigger(prev => !prev);
  // };

  

const handleExpenseUpdate = (updatedExpense: Expense) => {
  // Проверка наличия аккаунта у расхода
  if (!updatedExpense.account) {
    console.error('Updated expense does not have an associated account.');
    return;
  }

  // Обновление состояния транзакций
  setTransactions((prevTransactions) => {
    if (!prevTransactions) return null;
    const updatedExpenses = prevTransactions.expenses.map((expense) =>
      expense.id === updatedExpense.id ? { ...expense, ...updatedExpense } : expense
    );
    return { ...prevTransactions, expenses: updatedExpenses };
  });

  // Обновление состояния аккаунтов
  setAccounts((prevAccounts) => {
    return prevAccounts.map((acc) => {
      if (acc.id === updatedExpense.account.id) {
        // Вычисление нового баланса
        const oldExpenseAmount = updatedExpense.previousAmount || 0;
        const balanceDifference = updatedExpense.amount - oldExpenseAmount;
        const newBalance = acc.balance - balanceDifference;
        return { ...acc, balance: newBalance };
      }
      return acc;
    });
  });

  // Обновление UI без перезагрузки страницы
  setRefreshTrigger(prev => !prev);
};



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
                <EditIncome income={income} authToken={authToken} onIncomeUpdated={handleIncomeUpdate} />
                <DeleteIncome incomeId={income.id} authToken={authToken} onIncomeDeleted={handleIncomeDelete} />
              </li>
            ))}
          </ul>
          <h4>Расходы</h4>
          <ul>
            {transactions.expenses.map((expense) => (
              <li key={expense.id}>
                {expense.description} - {expense.amount} (Дата: {new Date(expense.createdAt).toLocaleDateString()})
                <EditExpense expense={expense} authToken={authToken} onExpenseUpdated={handleExpenseUpdate} />
                <DeleteExpense expenseId={expense.id} authToken={authToken} onExpenseDeleted={handleExpenseDelete} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AccountHistory;