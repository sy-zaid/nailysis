import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../pages/Login'
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />)
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  test('handles input changes', async () => {
    render(<Login />)
    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/password/i)

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')

    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  test('shows error message for invalid input', async () => {
    render(<Login />)
    const loginButton = screen.getByRole('button', { name: /login/i })

    await userEvent.click(loginButton)

    expect(await screen.findByText(/please enter valid credentials/i)).toBeInTheDocument()
  })
})