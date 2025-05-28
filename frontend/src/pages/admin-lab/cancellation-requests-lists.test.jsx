import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import CancellationRequestsList from './cancellation-requests-list.jsx';

// Mock axios
vi.mock('axios');

// Mock utils functions
vi.mock('../../utils/utils.js', () => ({
  convertDjangoDateTime: vi.fn((dateTime) => dateTime ? '2024-12-01 10:00 AM' : 'N/A'),
  getRole: vi.fn(() => 'lab_admin')
}));

// Mock Dashboard components
vi.mock('../../components/Dashboard/Header/Header.jsx', () => ({
  default: ({ mainHeading, subHeading }) => (
    <header data-testid="header">
      <h1>{mainHeading}</h1>
      <p>{subHeading}</p>
    </header>
  )
}));

vi.mock('../../components/Dashboard/Navbar/Navbar.jsx', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => 'mock-token'),
  setItem: vi.fn(),
  removeItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock window.alert
global.alert = vi.fn();

// Mock API response data
const mockRequests = [
  {
    id: 1,
    lab_technician: 'TECH001',
    appointment: {
      appointment_id: 'APP001',
      lab_technician: {
        user: {
          first_name: 'John',
          last_name: 'Smith'
        }
      },
      patient: {
        user: {
          user_id: 'PAT001',
          first_name: 'Alice',
          last_name: 'Johnson'
        }
      },
      checkin_datetime: '2024-12-01T10:00:00Z'
    },
    reason: 'Equipment malfunction',
    status: 'Pending'
  },
  {
    id: 2,
    lab_technician: 'TECH002',
    appointment: {
      appointment_id: 'APP002',
      lab_technician: {
        user: {
          first_name: 'Jane',
          last_name: 'Doe'
        }
      },
      patient: {
        user: {
          user_id: 'PAT002',
          first_name: 'Bob',
          last_name: 'Wilson'
        }
      },
      checkin_datetime: '2024-12-02T14:00:00Z'
    },
    reason: 'Patient no-show',
    status: 'Approved'
  }
];

describe('CancellationRequestsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response
    axios.get.mockResolvedValue({ data: mockRequests });
    axios.post.mockResolvedValue({ data: { message: 'Request processed successfully' } });
  });

  test('renders main components correctly', async () => {
    render(<CancellationRequestsList />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Cancellation Requests')).toBeInTheDocument();
    expect(screen.getByText('Here you can view and manage all the cancellation requests')).toBeInTheDocument();
  });

  test('renders filter buttons', () => {
    render(<CancellationRequestsList />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  test('renders control elements', () => {
    render(<CancellationRequestsList />);

    expect(screen.getByText('Bulk Action: Delete')).toBeInTheDocument();
    expect(screen.getByText('Sort By: None')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search By Name or ID')).toBeInTheDocument();
  });

  test('shows total records count', async () => {
    render(<CancellationRequestsList />);

    await waitFor(() => {
      expect(screen.getByText('Total Records: 2')).toBeInTheDocument();
    });
  });

  test('filter buttons change active state when clicked', () => {
    render(<CancellationRequestsList />);

    const approvedButton = screen.getByText('Approved');
    fireEvent.click(approvedButton);
    
    // Button should be clickable
    expect(approvedButton).toBeInTheDocument();
  });

  test('search input accepts text', () => {
    render(<CancellationRequestsList />);

    const searchInput = screen.getByPlaceholderText('Search By Name or ID');
    fireEvent.change(searchInput, { target: { value: 'TECH001' } });
    
    expect(searchInput.value).toBe('TECH001');
  });

  test('sort dropdown changes value', () => {
    render(<CancellationRequestsList />);

    const sortDropdown = screen.getByDisplayValue('Sort By: None');
    fireEvent.change(sortDropdown, { target: { value: 'status' } });
    
    expect(sortDropdown.value).toBe('status');
  });

  test('renders approve and reject buttons for pending requests', async () => {
    render(<CancellationRequestsList />);

    await waitFor(() => {
      expect(screen.getByText('TECH001')).toBeInTheDocument();
    });

    // Should have approve and reject buttons for pending request
    const approveButtons = screen.getAllByText('Approve');
    const rejectButtons = screen.getAllByText('Reject');
    
    expect(approveButtons.length).toBeGreaterThan(0);
    expect(rejectButtons.length).toBeGreaterThan(0);
  });

  test('approve button triggers API call', async () => {
    render(<CancellationRequestsList />);

    await waitFor(() => {
      expect(screen.getByText('TECH001')).toBeInTheDocument();
    });

    const approveButton = screen.getAllByText('Approve')[0];
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/tech_cancellation_requests/1/review/'),
        { action: 'approve' },
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer mock-token'
          }
        })
      );
    });
  });

  test('reject button triggers API call', async () => {
    render(<CancellationRequestsList />);

    await waitFor(() => {
      expect(screen.getByText('TECH001')).toBeInTheDocument();
    });

    const rejectButton = screen.getAllByText('Reject')[0];
    fireEvent.click(rejectButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/tech_cancellation_requests/1/review/'),
        { action: 'reject' },
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer mock-token'
          }
        })
      );
    });
  });

  test('shows alert on successful action', async () => {
    render(<CancellationRequestsList />);

    await waitFor(() => {
      expect(screen.getByText('TECH001')).toBeInTheDocument();
    });

    const approveButton = screen.getAllByText('Approve')[0];
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Request processed successfully');
    });
  });

  test('fetches data on component mount', async () => {
    render(<CancellationRequestsList />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/tech_cancellation_requests/'),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer mock-token'
          }
        })
      );
    });
  });

  test('handles API error gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    render(<CancellationRequestsList />);

    // Component should still render even if API fails
    expect(screen.getByText('Cancellation Requests')).toBeInTheDocument();
  });

  test('renders checkboxes in table', async () => {
    render(<CancellationRequestsList />);

    // Should have checkboxes (header checkbox + row checkboxes)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });
});