import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import NotFound from './NotFound'

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

test('renders 404 error message', () => {
  renderWithRouter(<NotFound />)
  
  expect(screen.getByText('404 | Page not found')).toBeInTheDocument()
})

test('renders go to homepage button', () => {
  renderWithRouter(<NotFound />)
  
  expect(screen.getByRole('button', { name: /go to homepage/i })).toBeInTheDocument()
})

test('navigates to dashboard when button is clicked', async () => {
  const user = userEvent.setup()
  renderWithRouter(<NotFound />)
  
  const button = screen.getByRole('button', { name: /go to homepage/i })
  await user.click(button)
  
  expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  expect(mockNavigate).toHaveBeenCalledTimes(1)
})

test('applies correct CSS class to container', () => {
  renderWithRouter(<NotFound />)
  
  const container = screen.getByText('404 | Page not found').closest('div')
  expect(container.className).toContain('container')
})

// The tests cover:

// Rendering the 404 message - Makes sure the error text appears
// Rendering the button - Confirms the "Go to homepage" button exists
// Navigation functionality - Tests that clicking the button calls navigate with '/dashboard'
// CSS class application - Verifies the container has the correct CSS class

// The key things I did:

// Mocked useNavigate since we can't actually navigate in tests
// Wrapped the component in BrowserRouter since it uses React Router
// Used userEvent to simulate real user interactions
// Kept the tests simple and focused on what the component actually does