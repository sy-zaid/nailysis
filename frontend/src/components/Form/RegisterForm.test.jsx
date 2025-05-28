import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import RegisterForm from './RegisterForm';

// Mock dependencies
vi.mock('../SocialLogin/SocialLogin', () => ({
  default: () => <div data-testid="social-login">Social Login Component</div>
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

vi.mock('../../api', () => ({
  default: {
    post: vi.fn()
  }
}));

vi.mock('react-toastify', () => ({
  toast: {
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Wrapper component for Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the registration form with all required fields', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/emergency contact/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  test('renders gender radio buttons', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    expect(screen.getByRole('radio', { name: /^male$/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^female$/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^other$/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^prefer not to say$/i })).toBeInTheDocument();
  });

  test('selects gender radio button', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const maleRadio = screen.getByRole('radio', { name: /^male$/i });
    fireEvent.click(maleRadio);
    
    expect(maleRadio).toBeChecked();
  });

  test('renders submit button and social login', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByTestId('social-login')).toBeInTheDocument();
  });

  test('updates first name input value', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    expect(firstNameInput.value).toBe('John');
  });

  test('updates last name input value', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    
    expect(lastNameInput.value).toBe('Doe');
  });

  test('updates email input value', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    expect(emailInput.value).toBe('john@example.com');
  });

  test('updates phone input value', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const phoneInput = screen.getByLabelText(/phone/i);
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    expect(phoneInput.value).toBe('1234567890');
  });

  test('updates date of birth input value', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const dobInput = screen.getByLabelText(/date of birth/i);
    fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
    
    expect(dobInput.value).toBe('1990-01-01');
  });

  test('updates address textarea value', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const addressInput = screen.getByLabelText(/address/i);
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });
    
    expect(addressInput.value).toBe('123 Main St');
  });

  test('updates emergency contact input value', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const emergencyInput = screen.getByLabelText(/emergency contact/i);
    fireEvent.change(emergencyInput, { target: { value: '0987654321' } });
    
    expect(emergencyInput.value).toBe('0987654321');
  });

  test('updates password input value', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput.value).toBe('password123');
  });

  test('updates confirm password input value', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    expect(confirmPasswordInput.value).toBe('password123');
  });

  test('form has correct attributes', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const form = screen.getByRole('form');
    expect(form).toHaveClass('form-container');
  });

  test('all input fields are required', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    expect(screen.getByLabelText(/first name/i)).toBeRequired();
    expect(screen.getByLabelText(/last name/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/phone/i)).toBeRequired();
    expect(screen.getByLabelText(/date of birth/i)).toBeRequired();
    expect(screen.getByLabelText(/address/i)).toBeRequired();
    expect(screen.getByLabelText(/emergency contact/i)).toBeRequired();
    expect(screen.getByLabelText(/^password$/i)).toBeRequired();
    expect(screen.getByLabelText(/confirm password/i)).toBeRequired();
  });

  test('gender radio buttons have correct values', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const maleRadio = screen.getByLabelText(/^male$/i);
    const femaleRadio = screen.getByLabelText(/^female$/i);
    const otherRadio = screen.getByLabelText(/^other$/i);
    const preferNotToSayRadio = screen.getByLabelText(/^prefer not to say$/i);
    
    expect(maleRadio).toHaveAttribute('value', 'M');
    expect(femaleRadio).toHaveAttribute('value', 'F');
    expect(otherRadio).toHaveAttribute('value', 'O');
    expect(preferNotToSayRadio).toHaveAttribute('value', 'P');
  });

  test('only one gender can be selected at a time', () => {
    renderWithRouter(<RegisterForm route="/api/register" />);
    
    const maleRadio = screen.getByLabelText(/^male$/i);
    const femaleRadio = screen.getByLabelText(/^female$/i);
    
    fireEvent.click(maleRadio);
    expect(maleRadio).toBeChecked();
    expect(femaleRadio).not.toBeChecked();
    
    fireEvent.click(femaleRadio);
    expect(femaleRadio).toBeChecked();
    expect(maleRadio).not.toBeChecked();
  });
});

