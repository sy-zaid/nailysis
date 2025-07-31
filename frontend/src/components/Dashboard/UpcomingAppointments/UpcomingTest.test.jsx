import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UpcomingAppointments from './UpcomingAppointments';

describe('UpcomingAppointments Component', () => {
  it('renders without crashing', () => {
    render(<UpcomingAppointments />);
  });

  it('displays the heading "Upcoming Tests"', () => {
    render(<UpcomingAppointments />);
    expect(screen.getByText('Upcoming Tests')).toBeInTheDocument();
  });

  it('displays "Next Checkup" text', () => {
    render(<UpcomingAppointments />);
    expect(screen.getByText('Next Checkup')).toBeInTheDocument();
  });

  it('displays the checkup date', () => {
    render(<UpcomingAppointments />);
    expect(screen.getByText('Fri, 24 Mar')).toBeInTheDocument();
  });

  it('displays the date navigation text', () => {
    render(<UpcomingAppointments />);
    expect(screen.getByText('20-March-24')).toBeInTheDocument();
  });

  it('renders the "Consult Now" button', () => {
    render(<UpcomingAppointments />);
    expect(screen.getByText('Consult Now')).toBeInTheDocument();
  });

  it('renders all required images with proper alt text', () => {
    render(<UpcomingAppointments />);
    
    expect(screen.getByAltText('calendar icon')).toBeInTheDocument();
    expect(screen.getByAltText('arrow left')).toBeInTheDocument();
    expect(screen.getByAltText('arrow right')).toBeInTheDocument();
    expect(screen.getByAltText('profiles')).toBeInTheDocument();
    expect(screen.getByAltText('up icon')).toBeInTheDocument();
  });

  it('renders the button as a button element', () => {
    render(<UpcomingAppointments />);
    const button = screen.getByRole('button', { name: /consult now/i });
    expect(button).toBeInTheDocument();
  });
});

// What these tests cover:
// 1. Basic component rendering without errors
// 2. Main "Upcoming Tests" heading is displayed
// 3. "Next Checkup" label text is present
// 4. Specific checkup date "Fri, 24 Mar" is shown
// 5. Date navigation text "20-March-24" is displayed
// 6. "Consult Now" button text is rendered
// 7. All 5 images are present with proper alt attributes (calendar, arrow left, arrow right, profiles, up icon)
// 8. Button element is properly accessible as a button role