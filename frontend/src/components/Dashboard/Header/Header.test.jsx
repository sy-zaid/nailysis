import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  test('renders with provided props', () => {
    render(
      <Header 
        mainHeading="Dashboard Overview"
        subHeading="Weekly Analytics Report"
      />
    );

    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Weekly Analytics Report')).toBeInTheDocument();
  });

  test('applies correct styling classes', () => {
    const { container } = render(<Header />);
    const headerDiv = container.firstChild;
    
    expect(headerDiv).toHaveClass('header');
  });
});