import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { EditExpenseProps } from '../../types';

const EditExpense: FC<EditExpenseProps> = ({ expense, authToken, onExpenseUpdated }) => {
  const [editMode, setEditMode] = useState(false); 
  
  const [editForm, setEditForm] = useState({
    description: expense.description,
    amount: expense.amount.toString(),
  });

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

    const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        description: editForm.description,
        expense: parseFloat(editForm.amount),
      };
      const response = await fetch(`${URL_API}/expense/${expense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to update expense.');
      }
      const updatedExpense = await response.json();
      onExpenseUpdated(updatedExpense); // Вызываем обработчик, который должен обновить состояние счетов
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  return (
    <div>
      {editMode ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
          />
          <input
            type="number"
            name="amount"
            value={editForm.amount}
            onChange={handleEditChange}
          />
          <button type="submit">Save Changes</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit</button>
      )}
    </div>
  );
};

export default EditExpense;
