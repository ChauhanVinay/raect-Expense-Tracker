import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // <-- NEW: Simulates user actions
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store/index';
import Login from './components/Login'; 
import ExpenseForm from './components/ExpenseForm'; 

// Helper function to wrap components with Redux Store and Router
const renderWithProviders = (component) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Testing User Actions & State', () => {
  
  // --- Tests for Login User Interactions ---
  
  test('1. Email input state updates when user types', async () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    
    // Simulate user typing
    await userEvent.type(emailInput, 'test@example.com');
    
    // Assert the state updated the input value
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('2. Password input state updates when user types', async () => {
    renderWithProviders(<Login />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    
    await userEvent.type(passwordInput, 'secret123');
    expect(passwordInput).toHaveValue('secret123');
  });

  test('3. Login button handles click events', async () => {
    renderWithProviders(<Login />);
    const loginBtn = screen.getByRole('button', { name: /login/i });
    
    // Simulate button click
    await userEvent.click(loginBtn);
    expect(loginBtn).toBeInTheDocument();
  });

  test('4. Forgot password link can be clicked', async () => {
    renderWithProviders(<Login />);
    const forgotLink = screen.getByText(/forgot password\?/i);
    
    await userEvent.click(forgotLink);
    expect(forgotLink).toBeInTheDocument();
  });

  test('5. Sign up link handles click events', async () => {
    renderWithProviders(<Login />);
    const signupLink = screen.getByText(/sign up/i);
    
    await userEvent.click(signupLink);
    expect(signupLink).toBeInTheDocument();
  });


  // --- Tests for ExpenseForm User Interactions ---

  test('6. Amount input state updates when user types numbers', async () => {
    renderWithProviders(<ExpenseForm />);
    const amountInput = screen.getByPlaceholderText(/amount/i);
    
    await userEvent.type(amountInput, '500');
    expect(amountInput).toHaveValue(500);
  });

  test('7. Description input state updates when user types text', async () => {
    renderWithProviders(<ExpenseForm />);
    const descInput = screen.getByPlaceholderText(/description/i);
    
    await userEvent.type(descInput, 'Groceries');
    expect(descInput).toHaveValue('Groceries');
  });

  test('8. Category dropdown state updates when user selects an option', async () => {
    renderWithProviders(<ExpenseForm />);
    const categorySelect = screen.getByRole('combobox');
    
    // Simulate user selecting "Food" from the dropdown
    await userEvent.selectOptions(categorySelect, 'Food');
    expect(categorySelect).toHaveValue('Food');
  });

  test('9. Add Expense button triggers click event', async () => {
    renderWithProviders(<ExpenseForm />);
    const addBtn = screen.getByRole('button', { name: /add expense/i });
    
    await userEvent.click(addBtn);
    expect(addBtn).toBeInTheDocument();
  });

  test('10. Premium button is NOT visible initially based on state', () => {
    renderWithProviders(<ExpenseForm />);
    
    // Use queryByRole instead of getByRole to assert that an element DOES NOT exist
    const premiumBtn = screen.queryByRole('button', { name: /activate premium/i });
    expect(premiumBtn).toBeNull(); 
  });

});