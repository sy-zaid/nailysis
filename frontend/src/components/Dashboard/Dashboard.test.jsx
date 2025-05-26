// Dashboard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';

// Mock all child components
jest.mock('./Cards/Cards', () => ({
  __esModule: true,
  default: ({ heading }) => (
    <div data-testid={`cards-${heading.toLowerCase()}`}>
      <h3>{heading} Card</h3>
    </div>
  )
}));

jest.mock('./Navbar/Navbar', () => ({
  __esModule: true,
  default: () => <nav data-testid="navbar">Navbar Component</nav>
}));

jest.mock('./Header/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header Component</header>
}));

jest.mock('./Sidebar/Sidebar', () => ({
  __esModule: true,
  default: () => <aside data-testid="sidebar">Sidebar Component</aside>
}));

jest.mock('./UpcomingTest/UpcomingTest', () => ({
  __esModule: true,
  default: () => <div data-testid="upcoming-test">UpcomingTest Component</div>
}));

describe('Dashboard', () => {
  test('renders all main components', () => {
    render(<Dashboard />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-test')).toBeInTheDocument();
  });

  test('renders all card components with correct headings', () => {
    render(<Dashboard />);

    expect(screen.getByTestId('cards-patients')).toBeInTheDocument();
    expect(screen.getByTestId('cards-requests')).toBeInTheDocument();
    expect(screen.getByTestId('cards-payments')).toBeInTheDocument();
    expect(screen.getByTestId('cards-reports')).toBeInTheDocument();

    expect(screen.getByText('Patients Card')).toBeInTheDocument();
    expect(screen.getByText('Requests Card')).toBeInTheDocument();
    expect(screen.getByText('Payments Card')).toBeInTheDocument();
    expect(screen.getByText('Reports Card')).toBeInTheDocument();
  });

  test('renders dropdown with correct options', () => {
    render(<Dashboard />);

    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    
    expect(screen.getByRole('option', { name: 'One Month' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Three Months' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Six Months' })).toBeInTheDocument();
  });

  test('dropdown has default value', () => {
    render(<Dashboard />);

    const dropdown = screen.getByRole('combobox');
    expect(dropdown.value).toBe('oneMonth');
  });

  test('dropdown value changes when option is selected', () => {
    render(<Dashboard />);

    const dropdown = screen.getByRole('combobox');
    
    fireEvent.change(dropdown, { target: { value: 'threeMonths' } });
    expect(dropdown.value).toBe('threeMonths');

    fireEvent.change(dropdown, { target: { value: 'sixMonths' } });
    expect(dropdown.value).toBe('sixMonths');
  });

  test('renders main layout structure correctly', () => {
    render(<Dashboard />);

    // Check if main sections are present
    const headerSection = screen.getByTestId('header').parentElement;
    expect(headerSection).toHaveClass('headerContent');

    // Check if cards section contains all cards
    const cardsSection = screen.getByTestId('cards-patients').parentElement;
    expect(cardsSection).toContainElement(screen.getByTestId('cards-patients'));
    expect(cardsSection).toContainElement(screen.getByTestId('cards-requests'));
    expect(cardsSection).toContainElement(screen.getByTestId('cards-payments'));
    expect(cardsSection).toContainElement(screen.getByTestId('cards-reports'));
  });

  test('all components are rendered in correct order', () => {
    render(<Dashboard />);

    const allElements = screen.getAllByTestId(/navbar|header|sidebar|cards-|upcoming-test/);
    
    // Check that navbar comes first
    expect(allElements[0]).toBe(screen.getByTestId('navbar'));
    
    // Check that upcoming test is rendered
    expect(screen.getByTestId('upcoming-test')).toBeInTheDocument();
  });

  test('dropdown contains correct option values', () => {
    render(<Dashboard />);

    const oneMonthOption = screen.getByRole('option', { name: 'One Month' });
    const threeMonthsOption = screen.getByRole('option', { name: 'Three Months' });
    const sixMonthsOption = screen.getByRole('option', { name: 'Six Months' });

    expect(oneMonthOption).toHaveValue('oneMonth');
    expect(threeMonthsOption).toHaveValue('threeMonths');
    expect(sixMonthsOption).toHaveValue('sixMonths');
  });

  test('dashboard layout has correct CSS classes', () => {
    const { container } = render(<Dashboard />);

    // Check for main layout classes (these will depend on your CSS module)
    const headerDiv = container.querySelector('[class*="header"]');
    const mainDiv = container.querySelector('[class*="main"]');
    const cardsDiv = container.querySelector('[class*="cards"]');
    const dropdownSelect = container.querySelector('[class*="dropdown"]');

    expect(headerDiv).toBeInTheDocument();
    expect(mainDiv).toBeInTheDocument();
    expect(cardsDiv).toBeInTheDocument();
    expect(dropdownSelect).toBeInTheDocument();
  });
});