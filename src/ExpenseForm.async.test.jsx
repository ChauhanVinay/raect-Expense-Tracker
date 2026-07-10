import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
import store from './store/index';
import ExpenseForm from './components/ExpenseForm'; 

const renderWithRedux = (component) => {
  return render(<Provider store={store}>{component}</Provider>);
};

// Mock the global fetch API using Vitest
global.fetch = vi.fn();

describe('ExpenseForm Async & Mocking Tests', () => {
  
  beforeEach(() => {
    fetch.mockClear();
  });

  test('1. Verifies a GET request is made on initial render', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    
    renderWithRedux(<ExpenseForm />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('.json'));
    });
  });

  test('2. Displays "Loading..." while fetching data', async () => {
    fetch.mockReturnValue(new Promise(() => {}));
    
    renderWithRedux(<ExpenseForm />);
    const loadingText = screen.getByText(/loading/i);
    expect(loadingText).toBeInTheDocument();
  });

  test('3. Displays "No expenses found" if the mocked GET API returns empty', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), 
    });
    
    renderWithRedux(<ExpenseForm />);
    
    const emptyText = await screen.findByText(/no expenses found/i);
    expect(emptyText).toBeInTheDocument();
  });

  test('4. Displays fetched expenses in the list after successful GET', async () => {
    const mockExpenses = {
      "id123": { amount: "500", description: "Food", category: "Food" }
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockExpenses,
    });
    
    renderWithRedux(<ExpenseForm />);
    
    const expenseItem = await screen.findByText(/500/i);
    expect(expenseItem).toBeInTheDocument();
  });

  test('5. Shows an error message if the GET API call fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });
    
    renderWithRedux(<ExpenseForm />);
    
    const errorMessage = await screen.findByText(/failed to fetch expenses/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('6. Makes a POST request when the user submits a new expense', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ name: 'newId999' }) });
    
    renderWithRedux(<ExpenseForm />);
    
    // WAIT for initial GET request to finish before interacting
    await screen.findByText(/no expenses found/i);
    
    await userEvent.type(screen.getByPlaceholderText(/amount/i), '200');
    await userEvent.type(screen.getByPlaceholderText(/description/i), 'Petrol');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'Petrol');
    
    await userEvent.click(screen.getByRole('button', { name: /add expense/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test('7. Clears the form inputs after a successful POST request', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ name: 'newId999' }) });
    
    renderWithRedux(<ExpenseForm />);
    
    // WAIT for initial GET request to finish
    await screen.findByText(/no expenses found/i);
    
    const amountInput = screen.getByPlaceholderText(/amount/i);
    await userEvent.type(amountInput, '200');
    
    // Fill out ALL required fields so HTML validation allows the submit
    await userEvent.type(screen.getByPlaceholderText(/description/i), 'Snacks');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'Food');
    
    await userEvent.click(screen.getByRole('button', { name: /add expense/i }));
    
    await waitFor(() => {
      expect(amountInput).toHaveValue(null); 
    });
  });

  test('8. Makes a DELETE request when the user clicks the delete button', async () => {
    const mockExpenses = { "id123": { amount: "500", description: "Food", category: "Food" } };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockExpenses }); 
    fetch.mockResolvedValueOnce({ ok: true }); 
    
    renderWithRedux(<ExpenseForm />);
    
    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    await userEvent.click(deleteBtn);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2); 
    });
  });

  test('9. Makes a PUT request when the user edits and updates an expense', async () => {
    const mockExpenses = { "id123": { amount: "500", description: "Food", category: "Food" } };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockExpenses }); 
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) }); 
    
    renderWithRedux(<ExpenseForm />);
    
    const editBtn = await screen.findByRole('button', { name: /edit/i });
    await userEvent.click(editBtn);
    
    const updateBtn = screen.getByRole('button', { name: /update expense/i });
    await userEvent.click(updateBtn);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2); 
    });
  });

  test('10. Shows an error message if adding a new expense fails', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) }); 
    fetch.mockResolvedValueOnce({ ok: false }); 
    
    renderWithRedux(<ExpenseForm />);
    
    // WAIT for initial GET request to finish
    await screen.findByText(/no expenses found/i);
    
    await userEvent.type(screen.getByPlaceholderText(/amount/i), '200');
    await userEvent.type(screen.getByPlaceholderText(/description/i), 'Test');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'Other');
    
    await userEvent.click(screen.getByRole('button', { name: /add expense/i }));
    
    const errorMessage = await screen.findByText(/failed to add expense/i);
    expect(errorMessage).toBeInTheDocument();
  });
});