import React, { useState, useEffect } from 'react';

// Notice we removed ".json" from the base URL here so we can append IDs dynamically
const FIREBASE_DB_URL = "https://react-form-24af0-default-rtdb.firebaseio.com/expenses";

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New state to track if we are editing an existing expense
  const [editId, setEditId] = useState(null); 

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${FIREBASE_DB_URL}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses.');
      }
      
      const data = await response.json();
      
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

  // Handles both Adding (POST) and Updating (PUT)
  const handleAddOrUpdateExpense = async (e) => {
    e.preventDefault();
    setError(null);

    const expenseData = {
      amount: amount,
      description: description,
      category: category,
    };

    try {
      if (editId) {
        // Deliverable 4: PUT request to update existing expense
        const response = await fetch(`${FIREBASE_DB_URL}/${editId}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });

        if (!response.ok) throw new Error('Failed to update expense.');

        // Update local state instantly
        setExpenses((prevExpenses) => 
          prevExpenses.map((exp) => exp.id === editId ? { id: editId, ...expenseData } : exp)
        );
        
        setEditId(null); // Turn off edit mode
      } else {
        // Normal POST request to add a new expense
        const response = await fetch(`${FIREBASE_DB_URL}.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });

        if (!response.ok) throw new Error('Failed to add expense.');
        
        const data = await response.json();
        setExpenses((prevExpenses) => [...prevExpenses, { id: data.name, ...expenseData }]);
      }

      // Clear the form fields
      setAmount('');
      setDescription('');
      setCategory('');
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Deliverable 1 & 2: Delete Request
  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`${FIREBASE_DB_URL}/${id}.json`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete expense.');

      console.log("Expense successfuly deleted"); // Exact string required by the assignment
      
      // Remove it from the screen locally
      setExpenses((prevExpenses) => prevExpenses.filter((exp) => exp.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Deliverable 3: Populate form for editing
  const handleEditClick = (expense) => {
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditId(expense.id); // Triggers Edit Mode
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {editId ? 'Edit Expense' : 'Add Daily Expense'}
      </h2>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleAddOrUpdateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

        <button type="submit" style={{ padding: '12px', backgroundColor: editId ? '#ffc107' : '#28a745', color: editId ? 'black' : 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          {editId ? 'Update Expense' : 'Add Expense'}
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
                <div style={{ flex: 1 }}>
                  <strong>{expense.category}</strong>
                  <div style={{ color: '#555', fontSize: '14px' }}>{expense.description}</div>
                </div>
                
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545', marginRight: '15px' }}>
                  ₹{expense.amount}
                </div>
                
                {/* Actions: Edit & Delete Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditClick(expense)} style={{ padding: '6px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteExpense(expense.id)} style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
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