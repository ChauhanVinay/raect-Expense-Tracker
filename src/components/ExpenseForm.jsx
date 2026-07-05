import React, { useState, useEffect } from 'react';

// Your specific Firebase Database URL + /expenses.json
const FIREBASE_DB_URL = "https://react-form-24af0-default-rtdb.firebaseio.com/expenses.json";

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Deliverable 2: GET request on page load to fetch existing expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(FIREBASE_DB_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses.');
      }
      
      const data = await response.json();
      
      // Firebase returns an object with unique keys, we need to convert it to an array
      const loadedExpenses = [];
      for (const key in data) {
        loadedExpenses.push({
          id: key,
          amount: data[key].amount,
          description: data[key].description,
          category: data[key].category,
        });
      }
      
      setExpenses(loadedExpenses);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Deliverable 1: POST request to save a new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError(null);

    const newExpense = {
      amount: amount,
      description: description,
      category: category,
    };

    try {
      const response = await fetch(FIREBASE_DB_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense.');
      }

      const data = await response.json();

      // Show it on the screen once we get a success (adding the Firebase-generated ID)
      setExpenses((prevExpenses) => [
        ...prevExpenses,
        { id: data.name, ...newExpense }
      ]);

      // Clear the form
      setAmount('');
      setDescription('');
      setCategory('');
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Daily Expense</h2>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

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

      <div style={{ marginTop: '40px' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Your Expenses</h3>
        
        {isLoading && <p style={{ textAlign: 'center', color: '#007bff' }}>Loading expenses...</p>}
        
        {!isLoading && expenses.length === 0 ? (
          <p style={{ color: '#777', textAlign: 'center' }}>No expenses found.</p>
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
};

export default ExpenseForm;