import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';
import styles from "../components/Form/Form.module.css";
// Mock the child components
vi.mock('../components/Form/LoginForm', () => ({
  default: ({ route }) => <div data-testid="login-form" data-route={route}>Login Form</div>
}));

vi.mock('../components/Picture/Picture', () => ({
  default: () => <div data-testid="picture">Picture Component</div>
}));

describe('Login', () => {
  it('renders without crashing', () => {
    render(<Login />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('picture')).toBeInTheDocument();
  });

  it('renders Picture component', () => {
    render(<Login />);
    
    expect(screen.getByTestId('picture')).toBeInTheDocument();
    expect(screen.getByText('Picture Component')).toBeInTheDocument();
  });

  it('renders LoginForm component', () => {
    render(<Login />);
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });

  it('passes default LoginEndpoint to LoginForm', () => {
    render(<Login />);
    
    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toHaveAttribute('data-route', '/api/token/');
  });

  it('passes custom LoginEndpoint to LoginForm when provided', () => {
    const customEndpoint = '/custom/login/';
    render(<Login LoginEndpoint={customEndpoint} />);
    
    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toHaveAttribute('data-route', customEndpoint);
  });

  
  
  it('has correct container structure with CSS class', () => {
    const { container } = render(<Login />);
    
    expect(container.firstChild).toHaveClass(styles.container);
  });

  it('renders both child components in correct order', () => {
    const { container } = render(<Login />);
    
    const children = container.firstChild.children;
    expect(children).toHaveLength(2);
    expect(children[0]).toHaveAttribute('data-testid', 'picture');
    expect(children[1]).toHaveAttribute('data-testid', 'login-form');
  });
});

/*
Test Coverage Summary:
- ✅ Component renders without crashing
- ✅ Picture component is rendered
- ✅ LoginForm component is rendered
- ✅ Default LoginEndpoint prop is passed correctly (/api/token/)
- ✅ Custom LoginEndpoint prop is passed when provided
- ✅ Container has correct CSS class applied
- ✅ Components are rendered in the correct order (Picture first, LoginForm second)
- ✅ Component structure and layout are maintained
*/