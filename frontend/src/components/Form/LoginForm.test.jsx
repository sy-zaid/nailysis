import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({ role: 'doctor' }))
}));

vi.mock('../../api', () => ({
  default: {
    post: vi.fn()
  }
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithRouter(<LoginForm route="/api/login" />);
  });

  it('displays the login heading', () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    expect(screen.getByText('Login to your account')).toBeInTheDocument();
  });

  it('renders email input field', () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
  });

  it('renders password input field', () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
  });

  it('renders login button', () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('updates email input value when typed', () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    const emailInput = screen.getByLabelText('Email');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password input value when typed', () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  it('shows error when submitting empty form', async () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email & Password are required.');
    });
  });

  it('shows error when email is missing', async () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email is required.');
    });
  });

  it('shows error when password is missing', async () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Password is required.');
    });
  });

  it('shows loading state when form is submitted', async () => {
    const mockApi = await import('../../api');
    mockApi.default.post.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithRouter(<LoginForm route="/api/login" />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Logging in...')).toBeInTheDocument();
    });
  });

  it('has correct form structure with proper labels and inputs', () => {
    renderWithRouter(<LoginForm route="/api/login" />);
    
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'text');
    expect(emailInput).toHaveAttribute('name', 'email');
    
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
  });
});

// What these tests cover:
// 1. Basic component rendering without errors
// 2. Login heading "Login to your account" is displayed
// 3. Email input field with proper label and placeholder
// 4. Password input field with proper label and placeholder
// 5. Login button is rendered and accessible
// 6. Email input updates correctly when user types
// 7. Password input updates correctly when user types
// 8. Form validation - shows error when both fields are empty
// 9. Form validation - shows error when email is missing
// 10. Form validation - shows error when password is missing
// 11. Loading state - button text changes to "Logging in..." during submission
// 12. Form structure - proper form element with correct input attributes