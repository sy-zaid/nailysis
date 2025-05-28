import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Register from './Register';

// Mock the child components
vi.mock('../components/Form/RegisterForm', () => ({
  default: ({ route }) => <div data-testid="register-form" data-route={route}>Register Form</div>
}));

vi.mock('../components/Picture/Picture', () => ({
  default: () => <div data-testid="picture">Picture Component</div>
}));

// Mock the CSS module
vi.mock('../components/Form/Form.module.css', () => ({
  default: {
    container: 'container'
  }
}));

describe('Register', () => {
  it('renders without crashing', () => {
    render(<Register />);
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.getByTestId('picture')).toBeInTheDocument();
  });

  it('renders Picture component', () => {
    render(<Register />);
    
    expect(screen.getByTestId('picture')).toBeInTheDocument();
    expect(screen.getByText('Picture Component')).toBeInTheDocument();
  });

  it('renders RegisterForm component', () => {
    render(<Register />);
    
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.getByText('Register Form')).toBeInTheDocument();
  });

  it('passes default registrationEndpoint to RegisterForm', () => {
    render(<Register />);
    
    const registerForm = screen.getByTestId('register-form');
    expect(registerForm).toHaveAttribute('data-route', '/api/user/register/');
  });

  it('passes custom registrationEndpoint to RegisterForm when provided', () => {
    const customEndpoint = '/custom/register/';
    render(<Register registrationEndpoint={customEndpoint} />);
    
    const registerForm = screen.getByTestId('register-form');
    expect(registerForm).toHaveAttribute('data-route', customEndpoint);
  });

  it('has correct container structure with CSS class', () => {
    const { container } = render(<Register />);
    
    expect(container.firstChild).toHaveClass('container');
  });

  it('renders both child components in correct order', () => {
    const { container } = render(<Register />);
    
    const children = container.firstChild.children;
    expect(children).toHaveLength(2);
    expect(children[0]).toHaveAttribute('data-testid', 'picture');
    expect(children[1]).toHaveAttribute('data-testid', 'register-form');
  });
});

/*
Test Coverage Summary:
- ✅ Component renders without crashing
- ✅ Picture component is rendered
- ✅ RegisterForm component is rendered
- ✅ Default registrationEndpoint prop is passed correctly (/api/user/register/)
- ✅ Custom registrationEndpoint prop is passed when provided
- ✅ Container has correct CSS class applied (with CSS module mock)
- ✅ Components are rendered in the correct order (Picture first, RegisterForm second)
- ✅ Component structure and layout are maintained
*/