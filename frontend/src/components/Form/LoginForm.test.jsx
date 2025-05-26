import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import LoginForm from './LoginForm';
import api from '../../api';

// Mock dependencies
jest.mock('react-toastify');
jest.mock('jwt-decode');
jest.mock('../../api');

// Mock localStorage with Jest mock functions
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Helper function to render with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders login form with all required elements', () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    
    expect(screen.getByRole('heading', { name: /login to your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(toast.error).toHaveBeenCalledWith('Email & Password are required.');
  });

  it('handles successful login for system admin', async () => {
    const mockResponse = {
      data: {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token'
      }
    };
    api.post.mockResolvedValueOnce(mockResponse);
    jwtDecode.mockReturnValueOnce({ role: 'system_admin' });

    renderWithRouter(<LoginForm route="/api/login" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/login', {
        email: 'admin@example.com',
        password: 'password123'
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('role', 'system_admin');
      expect(toast.success).toHaveBeenCalledWith('Login Successful!', expect.any(Object));
    });
  });

  it('handles login failure', async () => {
    api.post.mockRejectedValueOnce({
      response: { status: 401 }
    });

    renderWithRouter(<LoginForm route="/api/login" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Incorrect email or password.', expect.any(Object));
    });
  });

  it('handles network error', async () => {
    api.post.mockRejectedValueOnce(new Error('Network Error'));

    renderWithRouter(<LoginForm route="/api/login" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network Error');
    });
  });
});