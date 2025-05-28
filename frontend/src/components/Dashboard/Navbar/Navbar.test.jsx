import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Navbar'

// Mock the useNavigate hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

test('renders search section', () => {
  renderWithRouter(<Navbar />)
  
  expect(screen.getByText('Search...')).toBeInTheDocument()
})

test('renders search icon', () => {
  renderWithRouter(<Navbar />)
  
  const searchIcon = screen.getByAltText('search icon')
  expect(searchIcon).toBeInTheDocument()
  expect(searchIcon).toHaveAttribute('src', 'icon-search-black.png')
})

test('renders scan nails button', () => {
  renderWithRouter(<Navbar />)
  
  expect(screen.getByRole('button', { name: /scan nails/i })).toBeInTheDocument()
})

test('renders notification icon', () => {
  renderWithRouter(<Navbar />)
  
  const notificationIcon = screen.getByAltText('notification button')
  expect(notificationIcon).toBeInTheDocument()
  expect(notificationIcon).toHaveAttribute('src', 'icon-bell-black.png')
})

test('navigates to upload-image when scan nails button is clicked', async () => {
  const user = userEvent.setup()
  renderWithRouter(<Navbar />)
  
  const scanButton = screen.getByRole('button', { name: /scan nails/i })
  await user.click(scanButton)
  
  expect(mockNavigate).toHaveBeenCalledWith('/upload-image')
  expect(mockNavigate).toHaveBeenCalledTimes(1)
})

test('applies correct CSS class to nav container', () => {
  const { container } = renderWithRouter(<Navbar />)
  
  const navElement = container.firstChild
  expect(navElement.className).toContain('container')
})

test('has correct nav element structure', () => {
  renderWithRouter(<Navbar />)
  
  const navElement = screen.getByRole('navigation')
  expect(navElement).toBeInTheDocument()
})

// The tests cover:

// Search section rendering - Tests the "Search..." text appears
// Search icon - Verifies the search icon with correct src and alt text
// Scan Nails button - Confirms the button is rendered
// Notification icon - Tests the bell icon with correct attributes
// Navigation functionality - Tests clicking "Scan Nails" navigates to /upload-image
// CSS class application - Verifies the CSS module class is applied
// HTML structure - Confirms it renders as a proper <nav> element

// Key features tested:

// ✅ All visual elements (text, buttons, icons)
// ✅ Click handler and navigation logic
// ✅ React Router integration with mocked useNavigate
// ✅ Proper HTML semantics
// ✅ CSS module class application