import { useState } from "react";


const ExpenseForm = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    //state to store the list of expenses
    const [expenses, setExpenses] = useState([]);

   const handleAddExpense = (e) => {
        e.preventDefault();

        // Create a new expense object
        const newExpense = {
            id: Math.random().toString(),
            amount: amount,
            description: description,
            category: category,
        };
        // Add the new expense to the list
        setExpenses([...expenses, newExpense]);

        // Clear the form fields
        setAmount('');
        setDescription('');
        setCategory('');
   };

    return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Daily Expense</h2>
      
      {/* Form */}
      <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label style={{ fontWeight: 'bold' }}>Money Spent (₹):</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="e.g. 150"
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        
        <div>
          <label style={{ fontWeight: 'bold' }}>Description:</label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="e.g. Lunch at Cafe"
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>Category:</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="" disabled>Select a Category</option>
            <option value="Food">Food</option>
            <option value="Petrol">Petrol</option>
            <option value="Salary">Salary</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Add Expense
        </button>
      </form>

      {/* Display the expenses */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Your Expenses</h3>
        {expenses.length === 0 ? (
          <p style={{ color: '#777', textAlign: 'center' }}>No expenses added yet.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {expenses.map((expense) => (
              <li key={expense.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '4px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
                <div>
                  <strong>{expense.category}</strong>
                  <div style={{ color: '#555', fontSize: '14px' }}>{expense.description}</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545' }}>
                  ₹{expense.amount}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default ExpenseForm;