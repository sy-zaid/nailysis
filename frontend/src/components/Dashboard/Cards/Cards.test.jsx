import React from 'react';
import { render, screen } from '@testing-library/react';
import Cards from './Cards';

describe('Cards Component', () => {
  test('renders with default props', () => {
    render(<Cards heading="Test Card" />);
    
    expect(screen.getByText(/Test Card/i)).toBeInTheDocument();
    expect(screen.getByText(/20,549/i)).toBeInTheDocument();
    expect(screen.getByText(/\+15%/i)).toBeInTheDocument();
  });

  test('applies special styling for first card', () => {
    const { container } = render(<Cards heading="Patients" />);
    const card = container.firstChild;
    
    expect(card).toHaveStyle('background-color: #0067ff');
    expect(card).toHaveStyle('color: #ffffff');
  });

  test('applies regular styling for other cards', () => {
    const { container } = render(<Cards heading="Other" />);
    const card = container.firstChild;
    
    expect(card).toHaveStyle('background-color: #ffffff');
    expect(card).toHaveStyle('color: #000000');
  });
});