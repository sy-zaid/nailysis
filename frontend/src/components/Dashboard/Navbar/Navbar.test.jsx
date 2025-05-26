import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('triggers navigation when scan button is clicked', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    fireEvent.click(screen.getByText(/scan nails/i));
    expect(mockNavigate).toHaveBeenCalledWith('/upload-image');
  });

  it('displays all required UI elements', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // This line failed
    // expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    
    // Use getByText instead since "Search..." is an <h5> not an input
    expect(screen.getByText('Search...')).toBeInTheDocument();
    expect(screen.getByAltText('search icon')).toBeInTheDocument();
    expect(screen.getByAltText('notification button')).toBeInTheDocument();
  });
});
