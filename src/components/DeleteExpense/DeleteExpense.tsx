import { FC } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { DeleteExpenseProps } from '../../types';

const DeleteExpense: FC<DeleteExpenseProps> = ({ expenseId, authToken, onExpenseDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await fetch(`${URL_API}/expense/${expenseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
        });
        if (!response.ok) {
          const errorData = await response.json(); 
          console.error('Error updating expense:', errorData.message);
          alert(`Failed to update expense: ${errorData.message}`);
          return;
        }
        onExpenseDeleted(expenseId);
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
};

export default DeleteExpense;
