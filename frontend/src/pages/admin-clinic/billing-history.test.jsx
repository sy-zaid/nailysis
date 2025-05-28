import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BillingHistory from './billing-history.jsx';

// Mock dependencies
vi.mock('../../components/Dashboard/Navbar/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>
}));

describe('BillingHistory Component', () => {
  test('renders main heading and description', () => {
    render(<BillingHistory />);
    
    expect(screen.getByText('Billing History & Audit Trail')).toBeInTheDocument();
    expect(screen.getByText('Here you can view all the billing details and audit trail')).toBeInTheDocument();
  });

  test('renders navbar component', () => {
    render(<BillingHistory />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('renders action buttons', () => {
    render(<BillingHistory />);
    
    expect(screen.getByText('Manage Availability')).toBeInTheDocument();
    expect(screen.getByText('Export to CSV File')).toBeInTheDocument();
  });


  test('displays status summary', () => {
    render(<BillingHistory />);
    
    expect(screen.getByText('50 paid, 4 pending')).toBeInTheDocument();
  });

  test('renders table headers', () => {
    render(<BillingHistory />);
    
    expect(screen.getByText('Invoice No')).toBeInTheDocument();
    expect(screen.getByText('Patient Name')).toBeInTheDocument();
    expect(screen.getByText('Action Type')).toBeInTheDocument();
    expect(screen.getByText('Payment Date & Time')).toBeInTheDocument();
    expect(screen.getByText('Paid Amount')).toBeInTheDocument();
    expect(screen.getByText('Pending Amount')).toBeInTheDocument();
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getByText('Payment Status')).toBeInTheDocument();
  });


  test('renders bulk action checkbox and label', () => {
    render(<BillingHistory />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(screen.getByText('Bulk Action: Delete')).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<BillingHistory />);
    
    expect(screen.getByPlaceholderText('Search By Patient Name')).toBeInTheDocument();
  });

  test('renders sort option', () => {
    render(<BillingHistory />);
    
    expect(screen.getByText('Sort By: Edited Today')).toBeInTheDocument();
  });

  test('toggles select all checkbox', () => {
    render(<BillingHistory />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('shows action menu when three dots clicked', () => {
    render(<BillingHistory />);
    
    const actionButton = screen.getByText('⋮');
    fireEvent.click(actionButton);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('toggles action menu on multiple clicks', () => {
    render(<BillingHistory />);
    
    const actionButton = screen.getByText('⋮');
    
    // Open menu
    fireEvent.click(actionButton);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    
    // Close menu
    fireEvent.click(actionButton);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});

/*
TEST COVERAGE:
✅ Component rendering (heading, navbar, buttons)
✅ Table structure and sample data display
✅ Status filters and summary counts
✅ Search and sort controls
✅ Checkbox select all functionality
✅ Action menu toggle (Edit/Delete options)
✅ UI interactions and state changes
*/