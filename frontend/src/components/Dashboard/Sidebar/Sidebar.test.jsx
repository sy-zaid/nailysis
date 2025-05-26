// Sidebar.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';

// Mock the useCurrentUserData hook with the correct relative path
jest.mock('../../../useCurrentUserData', () => ({
  __esModule: true,
  default: () => ({
    data: [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        profile_picture: 'test-profile.jpg'
      }
    ]
  })
}));

// Mock the PopupEditProfile component
jest.mock('../../Popup/patient-edit-profile-popup', () => ({
  __esModule: true,
  default: ({ onClose }) => (
    <div data-testid="edit-profile-popup">
      <button onClick={onClose}>Close Popup</button>
    </div>
  )
}));

describe('Sidebar', () => {
  const defaultProps = {
    userRole: 'patient',
    setView: jest.fn(),
    isOpen: true,
    toggleSidebar: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sidebar with user information', () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Nailysis')).toBeInTheDocument();
    expect(screen.getByText('Clinical Application')).toBeInTheDocument();
  });

  test('renders dashboard and analytics buttons', () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
  });

  test('renders patient-specific menu items', () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText('Appointments')).toBeInTheDocument();
    expect(screen.getByText('Electronic Health Records')).toBeInTheDocument();
    expect(screen.getByText('Test Results')).toBeInTheDocument();
    expect(screen.getByText('Feedbacks')).toBeInTheDocument();
    expect(screen.getByText('Billing & Invoice')).toBeInTheDocument();
  });

  test('renders doctor-specific menu items', () => {
    const doctorProps = { ...defaultProps, userRole: 'doctor' };
    render(<Sidebar {...doctorProps} />);

    expect(screen.getByText('Appointments')).toBeInTheDocument();
    expect(screen.getByText('Electronic Health Records')).toBeInTheDocument();
    expect(screen.getByText('Feedbacks')).toBeInTheDocument();
    expect(screen.getByText('Billing & Invoice')).toBeInTheDocument();
    // Test Results should not be present for doctors
    expect(screen.queryByText('Test Results')).not.toBeInTheDocument();
  });

  test('calls setView when dashboard button is clicked', () => {
    const mockSetView = jest.fn();
    render(<Sidebar {...defaultProps} setView={mockSetView} />);

    const dashboardButtons = screen.getAllByText('Dashboard');
    fireEvent.click(dashboardButtons[0]);

    expect(mockSetView).toHaveBeenCalledWith('');
  });

  test('calls setView when analytics button is clicked', () => {
    const mockSetView = jest.fn();
    render(<Sidebar {...defaultProps} setView={mockSetView} />);

    fireEvent.click(screen.getByText('Reports & Analytics'));

    expect(mockSetView).toHaveBeenCalledWith('Analytics');
  });

  test('expands dropdown when main menu item with subitems is clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const appointmentsButton = screen.getByText('Appointments');
    fireEvent.click(appointmentsButton);

    // Check if dropdown items appear
    expect(screen.getByText('Clinic Appointments')).toBeInTheDocument();
    expect(screen.getByText('Lab Appointments')).toBeInTheDocument();
    expect(screen.getByText('Appointments History')).toBeInTheDocument();
  });

  test('calls setView when dropdown item is clicked', () => {
    const mockSetView = jest.fn();
    render(<Sidebar {...defaultProps} setView={mockSetView} />);

    // First expand the dropdown
    fireEvent.click(screen.getByText('Appointments'));
    
    // Then click a dropdown item
    fireEvent.click(screen.getByText('Clinic Appointments'));

    expect(mockSetView).toHaveBeenCalledWith('Clinic Appointments');
  });

  test('calls setView directly for menu items without subitems', () => {
    const mockSetView = jest.fn();
    render(<Sidebar {...defaultProps} setView={mockSetView} />);

    fireEvent.click(screen.getByText('Test Results'));

    expect(mockSetView).toHaveBeenCalledWith('Test Results');
  });

  test('shows edit profile popup when edit profile is clicked', () => {
    render(<Sidebar {...defaultProps} />);

    fireEvent.click(screen.getByText('Edit Profile'));

    expect(screen.getByTestId('edit-profile-popup')).toBeInTheDocument();
  });

  test('closes popup when close button is clicked', () => {
    render(<Sidebar {...defaultProps} />);

    // Open popup
    fireEvent.click(screen.getByText('Edit Profile'));
    expect(screen.getByTestId('edit-profile-popup')).toBeInTheDocument();

    // Close popup
    fireEvent.click(screen.getByText('Close Popup'));
    expect(screen.queryByTestId('edit-profile-popup')).not.toBeInTheDocument();
  });

  test('renders floating buttons when sidebar is closed', () => {
    const closedProps = { ...defaultProps, isOpen: false };
    render(<Sidebar {...closedProps} />);

    expect(screen.getByTitle('Dashboard')).toBeInTheDocument();
    expect(screen.getByTitle('Test Results')).toBeInTheDocument();
    expect(screen.getByTitle('Diagnostic Results')).toBeInTheDocument();
    expect(screen.getByTitle('Appointments')).toBeInTheDocument();
    expect(screen.getByTitle('Billing & Invoice')).toBeInTheDocument();
    expect(screen.getByTitle('Feedbacks')).toBeInTheDocument();
  });

  test('calls toggleSidebar when toggle button is clicked', () => {
    const mockToggleSidebar = jest.fn();
    const closedProps = { ...defaultProps, isOpen: false, toggleSidebar: mockToggleSidebar };
    render(<Sidebar {...closedProps} />);

    const toggleButton = screen.getByAltText('menu button');
    fireEvent.click(toggleButton.parentElement);

    expect(mockToggleSidebar).toHaveBeenCalled();
  });

  test('renders close button when sidebar is open', () => {
    const mockToggleSidebar = jest.fn();
    render(<Sidebar {...defaultProps} toggleSidebar={mockToggleSidebar} />);

    const closeButton = screen.getByAltText('close button');
    fireEvent.click(closeButton);

    expect(mockToggleSidebar).toHaveBeenCalled();
  });

  test('renders different menu items for different user roles', () => {
    const { rerender } = render(<Sidebar {...defaultProps} userRole="lab_admin" />);

    expect(screen.getByText('Test Requests')).toBeInTheDocument();

    rerender(<Sidebar {...defaultProps} userRole="clinic_admin" />);
    
    expect(screen.queryByText('Test Requests')).not.toBeInTheDocument();
  });
});