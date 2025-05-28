import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Sidebar from './Sidebar'

// Mock the custom hook
vi.mock('../../../useCurrentUserData', () => ({
  default: () => ({
    data: [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        profile_picture: 'john-profile.jpg'
      }
    ]
  })
}))

// Mock the popup component
vi.mock('../../Popup/patient-edit-profile-popup', () => ({
  default: ({ onClose }) => (
    <div data-testid="edit-profile-popup">
      <button onClick={onClose}>Close Popup</button>
    </div>
  )
}))

const defaultProps = {
  userRole: 'patient',
  setView: vi.fn(),
  isOpen: false,
  toggleSidebar: vi.fn()
}

test('renders toggle button when sidebar is closed', () => {
  render(<Sidebar {...defaultProps} />)
  
  const toggleButton = screen.getByAltText('menu button').closest('button')
  expect(toggleButton).toBeInTheDocument()
})

test('renders floating buttons when sidebar is closed', () => {
  render(<Sidebar {...defaultProps} />)
  
  expect(screen.getByAltText('Dashboard')).toBeInTheDocument()
  expect(screen.getByAltText('Test Results')).toBeInTheDocument()
  expect(screen.getByAltText('Appointments')).toBeInTheDocument()
})

test('renders sidebar content when open', () => {
  render(<Sidebar {...defaultProps} isOpen={true} />)
  
  expect(screen.getByText('Nailysis')).toBeInTheDocument()
  expect(screen.getByText('Clinical Application')).toBeInTheDocument()
  expect(screen.getByText('Dashboard')).toBeInTheDocument()
  expect(screen.getByText('Reports & Analytics')).toBeInTheDocument()
})

test('renders close button when sidebar is open', () => {
  render(<Sidebar {...defaultProps} isOpen={true} />)
  
  expect(screen.getByAltText('close button')).toBeInTheDocument()
})

test('renders user profile information', () => {
  render(<Sidebar {...defaultProps} isOpen={true} />)
  
  expect(screen.getByText('John Doe')).toBeInTheDocument()
  expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
})

test('renders menu items for patient role', () => {
  render(<Sidebar {...defaultProps} userRole="patient" isOpen={true} />)
  
  expect(screen.getByText('Appointments')).toBeInTheDocument()
  expect(screen.getByText('Electronic Health Records')).toBeInTheDocument()
  expect(screen.getByText('Test Results')).toBeInTheDocument()
  expect(screen.getByText('Feedbacks')).toBeInTheDocument()
  expect(screen.getByText('Billing & Invoice')).toBeInTheDocument()
})

test('renders menu items for doctor role', () => {
  render(<Sidebar {...defaultProps} userRole="doctor" isOpen={true} />)
  
  expect(screen.getByText('Appointments')).toBeInTheDocument()
  expect(screen.getByText('Electronic Health Records')).toBeInTheDocument()
  expect(screen.getByText('Feedbacks')).toBeInTheDocument()
  expect(screen.getByText('Billing & Invoice')).toBeInTheDocument()
})

test('calls setView when Dashboard button is clicked', async () => {
  const user = userEvent.setup()
  const mockSetView = vi.fn()
  
  render(<Sidebar {...defaultProps} setView={mockSetView} isOpen={true} />)
  
  const dashboardButton = screen.getByText('Dashboard')
  await user.click(dashboardButton)
  
  expect(mockSetView).toHaveBeenCalledWith('')
})

test('calls setView when Analytics button is clicked', async () => {
  const user = userEvent.setup()
  const mockSetView = vi.fn()
  
  render(<Sidebar {...defaultProps} setView={mockSetView} isOpen={true} />)
  
  const analyticsButton = screen.getByText('Reports & Analytics')
  await user.click(analyticsButton)
  
  expect(mockSetView).toHaveBeenCalledWith('Analytics')
})

test('calls toggleSidebar when toggle button is clicked', async () => {
  const user = userEvent.setup()
  const mockToggleSidebar = vi.fn()
  
  render(<Sidebar {...defaultProps} toggleSidebar={mockToggleSidebar} />)
  
  const toggleButton = screen.getByAltText('menu button').closest('button')
  await user.click(toggleButton)
  
  expect(mockToggleSidebar).toHaveBeenCalled()
})

test('calls toggleSidebar when close button is clicked', async () => {
  const user = userEvent.setup()
  const mockToggleSidebar = vi.fn()
  
  render(<Sidebar {...defaultProps} toggleSidebar={mockToggleSidebar} isOpen={true} />)
  
  const closeButton = screen.getByAltText('close button').closest('button')
  await user.click(closeButton)
  
  expect(mockToggleSidebar).toHaveBeenCalled()
})

test('shows edit profile popup when edit profile is clicked', async () => {
  const user = userEvent.setup()
  
  render(<Sidebar {...defaultProps} isOpen={true} />)
  
  const editProfileLink = screen.getByText('Edit Profile')
  await user.click(editProfileLink)
  
  expect(screen.getByTestId('edit-profile-popup')).toBeInTheDocument()
})

test('hides popup when close is clicked', async () => {
  const user = userEvent.setup()
  
  render(<Sidebar {...defaultProps} isOpen={true} />)
  
  // Open popup
  const editProfileLink = screen.getByText('Edit Profile')
  await user.click(editProfileLink)
  
  // Close popup
  const closeButton = screen.getByText('Close Popup')
  await user.click(closeButton)
  
  expect(screen.queryByTestId('edit-profile-popup')).not.toBeInTheDocument()
})

test('expands dropdown when menu item with subitems is clicked', async () => {
  const user = userEvent.setup()
  
  render(<Sidebar {...defaultProps} userRole="patient" isOpen={true} />)
  
  const appointmentsButton = screen.getAllByText('Appointments')[0]
  await user.click(appointmentsButton)
  
  expect(screen.getByText('Clinic Appointments')).toBeInTheDocument()
  expect(screen.getByText('Lab Appointments')).toBeInTheDocument()
})

test('calls setView when floating button is clicked', async () => {
  const user = userEvent.setup()
  const mockSetView = vi.fn()
  
  render(<Sidebar {...defaultProps} setView={mockSetView} />)
  
  const testResultsButton = screen.getByAltText('Test Results').closest('div')
  await user.click(testResultsButton)
  
  expect(mockSetView).toHaveBeenCalledWith('Test Results')
})


// The tests cover:

// Basic rendering - Toggle button, floating buttons, sidebar content
// Conditional rendering - Different content when open/closed
// User profile display - Shows user name and email from mock data
// Role-based menus - Different menu items for patient vs doctor
// Button interactions - Dashboard, Analytics, toggle, and close buttons
// Popup functionality - Edit profile popup show/hide
// Dropdown functionality - Menu items with sub-items expand/collapse
// Floating buttons - Quick access buttons when sidebar is closed

// Key features:

// ✅ Mocked the useCurrentUserData hook with sample user data
// ✅ Mocked the popup component to avoid complex dependencies
// ✅ Tests all the main user interactions (clicks, navigation)
// ✅ Tests conditional rendering based on isOpen prop
// ✅ Tests role-based menu rendering
// ✅ Tests state management (dropdowns, popups)