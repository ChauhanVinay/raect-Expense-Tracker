import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('Expense Tracker App Tests', () => {
  
  // --- Test Cases for Login Component ---
  
  test('1. renders the Login heading', () => {
    renderWithProviders(<Login />);
    const headingElement = screen.getByRole('heading', { name: /login/i });
    expect(headingElement).toBeInTheDocument();
  });

  test('2. renders the Email input field', () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();
  });

  test('3. renders the Password input field', () => {
    renderWithProviders(<Login />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  test('4. renders the Login button', () => {
    renderWithProviders(<Login />);
    const buttonElement = screen.getByRole('button', { name: /login/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('5. renders the Forgot password link', () => {
    renderWithProviders(<Login />);
    const forgotLink = screen.getByText(/forgot password\?/i);
    expect(forgotLink).toBeInTheDocument();
  });

  test('6. renders the Sign up link text', () => {
    renderWithProviders(<Login />);
    const signUpText = screen.getByText(/don't have an account\?/i);
    expect(signUpText).toBeInTheDocument();
  });


  // --- Test Cases for ExpenseForm Component ---

  test('7. renders the ExpenseForm heading', () => {
    renderWithProviders(<ExpenseForm />);
    const headingElement = screen.getByRole('heading', { name: /add daily expense/i });
    expect(headingElement).toBeInTheDocument();
  });

  test('8. renders the Amount input field', () => {
    renderWithProviders(<ExpenseForm />);
    const amountInput = screen.getByPlaceholderText(/amount/i);
    expect(amountInput).toBeInTheDocument();
  });

  test('9. renders the Description input field', () => {
    renderWithProviders(<ExpenseForm />);
    const descInput = screen.getByPlaceholderText(/description/i);
    expect(descInput).toBeInTheDocument();
  });

  test('10. renders the Category dropdown', () => {
    renderWithProviders(<ExpenseForm />);
    const comboElement = screen.getByRole('combobox');
    expect(comboElement).toBeInTheDocument();
  });

});