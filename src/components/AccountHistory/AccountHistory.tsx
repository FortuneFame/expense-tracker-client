import { useState, useEffect, FC } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { AccountHistoryProps, AccountSummaryResponse, TransactionsResponse } from '../../types';
import { TableContainer, Paper, Table, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export type TransactionType = 'income' | 'expense';

const AccountHistory: FC<AccountHistoryProps> = ({ authToken, account, refreshTrigger, setRefreshTrigger }) => {
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState<number>(account.balance);
  

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

      setRefreshTrigger((prev: boolean) => !prev);

      const transaction = transactions && (type === 'income'
        ? transactions.incomes.find(t => t.id === transactionId)
        : transactions.expenses.find(t => t.id === transactionId));
      
      const amount = transaction ? transaction.amount : 0;

      const updatedBalance = type === 'income' ? currentBalance - amount : currentBalance + amount;
      setCurrentBalance(updatedBalance);
      
    } catch (error: unknown) {

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Неизвестная ошибка");
      }
    }
  }

  if (error) return <p>Ошибка: {error}</p>;

  return (
   
    <div>
      {!loading && !error && transactions && (
        <>
          {transactions.incomes.length > 0 && (
            <TableContainer component={Paper}>
              <h3 style={{ textAlign: 'center' }}>Доходы</h3>
              <Table>
                <TableBody>
                  {transactions.incomes.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell component="th" scope="row">
                        {income.description}
                      </TableCell>
                      <TableCell align="right">{income.amount}</TableCell>
                      <TableCell align="right">{new Date(income.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => deleteTransaction('income', income.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {transactions.expenses.length > 0 && (
            <TableContainer component={Paper}>
              <h3 style={{ textAlign: 'center' }}>Расходы</h3>
              <Table>
      
                <TableBody>
                  {transactions.expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell component="th" scope="row">
                        {expense.description}
                      </TableCell>
                      <TableCell align="right">{expense.amount}</TableCell>
                      <TableCell align="right">{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => deleteTransaction('expense', expense.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </div>
  );
};

export default AccountHistory;