import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from './Dashboard';

// Mock the child components
vi.mock('./Cards/Cards', () => ({
  default: ({ heading }) => <div data-testid="cards">{heading}</div>
}));

vi.mock('./Navbar/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('./Header/Header', () => ({
  default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Sidebar/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

vi.mock('./UpcomingTest/UpcomingTest', () => ({
  default: () => <div data-testid="upcoming-test">UpcomingTest</div>
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    render(<Dashboard />);
  });

  it('renders without crashing', () => {
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the Navbar component', () => {
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders the Header component', () => {
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the dropdown with time period options', () => {
    const dropdown = screen.getByRole('combobox');
    const options = ['One Month', 'Three Months', 'Six Months'];
    
    options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('has default dropdown selection as "One Month"', () => {
    const dropdown = screen.getByRole('combobox');
    expect(dropdown.value).toBe('oneMonth');
  });

  it('renders the Sidebar component', () => {
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders all four Cards components with correct headings', () => {
    const headings = ['Patients', 'Requests', 'Payments', 'Reports'];
    
    headings.forEach(heading => {
      expect(screen.getByText(heading)).toBeInTheDocument();
    });
  });

  it('renders the UpcomingTest component', () => {
    expect(screen.getByTestId('upcoming-test')).toBeInTheDocument();
  });
});

// What these tests cover:
// 1. Basic component rendering without errors
// 2. Navbar component is rendered and present
// 3. Header component is rendered and present
// 4. Dropdown select element is present with all three time period options
// 5. Sidebar component is rendered and present
// 6. All four Cards components are rendered with correct headings (Patients, Requests, Payments, Reports)
// 7. UpcomingTest component is rendered and present
// 8. Default dropdown value is set to "oneMonth"