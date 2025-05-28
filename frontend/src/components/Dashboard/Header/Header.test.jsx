import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Header from './Header'

test('renders main heading', () => {
  render(<Header mainHeading="Dashboard" subHeading="Welcome back!" />)
  
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
})

test('renders sub heading', () => {
  render(<Header mainHeading="Dashboard" subHeading="Welcome back!" />)
  
  expect(screen.getByText('Welcome back!')).toBeInTheDocument()
})

test('renders both headings with different text', () => {
  render(<Header mainHeading="Analytics" subHeading="View your data insights" />)
  
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Analytics')
  expect(screen.getByText('View your data insights')).toBeInTheDocument()
})

test('renders without crashing when props are empty', () => {
  render(<Header mainHeading="" subHeading="" />)
  
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('')
})

test('applies correct CSS class to header container', () => {
  const { container } = render(<Header mainHeading="Test" subHeading="Test sub" />)
  
  const headerDiv = container.firstChild
  expect(headerDiv.className).toContain('header')
})

test('renders paragraph element for sub heading', () => {
  render(<Header mainHeading="Test Main" subHeading="Test Sub" />)
  
  const paragraph = screen.getByText('Test Sub')
  expect(paragraph.tagName).toBe('P')
})

// The tests cover:

// Main heading rendering - Tests the h1 element with provided text
// Sub heading rendering - Tests the paragraph element with provided text
// Different prop values - Ensures it works with various text inputs
// Empty props handling - Tests behavior with empty strings
// CSS class application - Verifies the CSS module class is applied
// HTML structure - Confirms the sub heading uses a <p> tag