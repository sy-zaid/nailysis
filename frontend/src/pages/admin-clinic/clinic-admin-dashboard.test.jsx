import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ClinicAdminDashboard from './clinic-admin-dashboard';

// Mock all the child components to avoid dependencies
vi.mock('../../components/Dashboard/Cards/Cards', () => ({
  default: ({ heading }) => <div data-testid="cards-component">{heading}</div>
}));

vi.mock('../../components/Dashboard/Navbar/Navbar', () => ({
  default: () => <div data-testid="navbar-component">Navbar</div>
}));

vi.mock('../../components/Dashboard/Header/Header', () => ({
  default: ({ curUserRole, genderPrefix }) => (
    <div data-testid="header-component">
      {genderPrefix} {curUserRole}
    </div>
  )
}));

vi.mock('../../components/Dashboard/Sidebar/Sidebar', () => ({
  default: () => <div data-testid="sidebar-component">Sidebar</div>
}));

vi.mock('../../components/Dashboard/UpcomingTest/UpcomingTest', () => ({
  default: () => <div data-testid="upcoming-test-component">UpcomingTest</div>
}));

vi.mock('./cancellation-requests-list', () => ({
  default: () => <div data-testid="cancellation-requests-component">CancellationRequestsList</div>
}));

// Mock CSS modules
vi.mock('../../components/Dashboard/Dashboard.module.css', () => ({
  default: {
    header: 'header',
    headerContent: 'headerContent',
    dropdown: 'dropdown',
    main: 'main',
    cards: 'cards'
  }
}));

describe('ClinicAdminDashboard', () => {
  it('renders without crashing', () => {
    render(<ClinicAdminDashboard />);
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  it('displays the correct header with role and gender prefix', () => {
    render(<ClinicAdminDashboard />);
    expect(screen.getByTestId('header-component')).toHaveTextContent('Mr. Clinic Admin Dashboard');
  });

  it('renders all four card components with correct headings', () => {
    render(<ClinicAdminDashboard />);
    expect(screen.getByText('Patients')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('renders the dropdown with time period options', () => {
    render(<ClinicAdminDashboard />);
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText('One Month')).toBeInTheDocument();
    expect(screen.getByText('Three Months')).toBeInTheDocument();
    expect(screen.getByText('Six Months')).toBeInTheDocument();
  });

  it('renders all required child components', () => {
    render(<ClinicAdminDashboard />);
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
    expect(screen.getByTestId('header-component')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-test-component')).toBeInTheDocument();
    expect(screen.getByTestId('cancellation-requests-component')).toBeInTheDocument();
  });

  it('has the correct number of Cards components', () => {
    render(<ClinicAdminDashboard />);
    const cardComponents = screen.getAllByTestId('cards-component');
    expect(cardComponents).toHaveLength(4);
  });
});

/*
Test Coverage Summary:
✅ Component renders without errors
✅ Header displays correct user role and gender prefix
✅ All four Cards components render with proper headings (Patients, Requests, Payments, Reports)
✅ Dropdown menu renders with all time period options
✅ All child components are present (Navbar, Header, UpcomingTest, CancellationRequestsList)
✅ Correct number of Cards components (4 total)
*/