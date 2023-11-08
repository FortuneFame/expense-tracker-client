import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { URL_API } from '../../constants/constantsApp';
import { EditIncomeProps } from '../../types';

const EditIncome: FC<EditIncomeProps> = ({ income, authToken, onIncomeUpdated }) => {
  const [editForm, setEditForm] = useState({
    description: income.description,
    amount: income.amount,
  });

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL_API}/income/${income.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) {
        throw new Error('Failed to update income.');
      }
      const updatedIncome = await response.json();
      onIncomeUpdated(updatedIncome);
    } catch (error) {
      console.error('Error updating income:', error);
    }
  };

  return (
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
    </form>
  );
};

export default EditIncome;
