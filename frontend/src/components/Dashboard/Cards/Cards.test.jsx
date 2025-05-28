import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Cards from './Cards'

test('renders card with provided heading', () => {
  render(<Cards heading="Patients" />)
  
  expect(screen.getByText('Patients')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Patients' })).toBeInTheDocument()
})

test('renders count and percentage', () => {
  render(<Cards heading="Patients" />)
  
  expect(screen.getByText('20,549')).toBeInTheDocument()
  expect(screen.getByText('+15%')).toBeInTheDocument()
})

test('renders footer text', () => {
  render(<Cards heading="Patients" />)
  
  expect(screen.getByText(/Data obtained from the past 7 days/)).toBeInTheDocument()
})

test('renders stock icon image', () => {
  render(<Cards heading="Patients" />)
  
  const image = screen.getByAltText('stocks icon')
  expect(image).toBeInTheDocument()
  expect(image).toHaveAttribute('src', 'icon-stocks-black.png')
})

test('applies blue background for Patients card', () => {
  const { container } = render(<Cards heading="Patients" />)
  
  const card = container.firstChild
  expect(card).toHaveStyle({ backgroundColor: '#0067ff', color: '#ffffff' })
})

test('applies white background for non-Patients card', () => {
  const { container } = render(<Cards heading="Doctors" />)
  
  const card = container.firstChild
  expect(card).toHaveStyle({ backgroundColor: '#ffffff', color: '#000000' })
})

test('applies correct percent style for Patients card', () => {
  render(<Cards heading="Patients" />)
  
  const percentDiv = screen.getByText('+15%').closest('div')
  expect(percentDiv).toHaveStyle({ backgroundColor: '#ffffff' })
})

test('applies correct percent style for non-Patients card', () => {
  render(<Cards heading="Revenue" />)
  
  const percentDiv = screen.getByText('+15%').closest('div')
  expect(percentDiv).toHaveStyle({ backgroundColor: '#0067ff' })
})

test('renders with different heading text', () => {
  render(<Cards heading="Revenue" />)
  
  expect(screen.getByText('Revenue')).toBeInTheDocument()
})

// The tests cover:

// Basic rendering - Heading, count, percentage, footer text
// Image rendering - Stock icon with correct src and alt text
// Conditional styling - Different styles for "Patients" vs other cards
// Background colors - Blue for "Patients", white for others
// Percentage styling - White background for "Patients", blue for others
// Flexibility - Works with different heading props

// The key features tested:

// ✅ Props handling (heading)
// ✅ Conditional styling logic (isFirstCard)
// ✅ Static content (count, percentage, footer)
// ✅ Image attributes
// ✅ Inline styles application