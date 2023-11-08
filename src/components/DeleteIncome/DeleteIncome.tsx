import { FC } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { DeleteIncomeProps } from '../../types';

const DeleteIncome: FC<DeleteIncomeProps> = ({ incomeId, authToken, onIncomeDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        const response = await fetch(`${URL_API}/income/${incomeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete income.');
        }
        onIncomeDeleted(incomeId);
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
};

export default DeleteIncome;
