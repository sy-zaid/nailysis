import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PatientProfileClinicAdmin from './patient-profile-clinic-admin';

// Mock CSS modules
vi.mock('./patient-profile-clinic-admin.Module.css', () => ({}));

describe('PatientProfileClinicAdmin', () => {
  it('renders without crashing', () => {
    render(<PatientProfileClinicAdmin />);
    expect(screen.getByText('Mr. John Doe')).toBeInTheDocument();
  });

  it('displays patient basic information', () => {
    render(<PatientProfileClinicAdmin />);
    expect(screen.getByText('Mr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Accountant at XYZ Company')).toBeInTheDocument();
  });

  it('renders patient profile image with correct alt text', () => {
    render(<PatientProfileClinicAdmin />);
    const patientImage = screen.getByAltText('patient picture');
    expect(patientImage).toBeInTheDocument();
    expect(patientImage).toHaveAttribute('src', '/patient.png');
  });

  it('displays action buttons', () => {
    render(<PatientProfileClinicAdmin />);
    expect(screen.getByText('Contact Patient')).toBeInTheDocument();
    expect(screen.getByText('Add Appointment')).toBeInTheDocument();
  });

  it('renders all section titles', () => {
    render(<PatientProfileClinicAdmin />);
    expect(screen.getByText('Medical Information')).toBeInTheDocument();
    expect(screen.getByText('Disease Detection')).toBeInTheDocument();
    expect(screen.getByText('Test Reports')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  it('displays medical information details', () => {
    render(<PatientProfileClinicAdmin />);
    expect(screen.getByText('Schedule Appointment')).toBeInTheDocument();
    expect(screen.getByText('10/10/2024 09:30 PM')).toBeInTheDocument();
    expect(screen.getByText('Special Notes')).toBeInTheDocument();
    expect(screen.getByText('This Patient is deaf')).toBeInTheDocument();
    expect(screen.getByText('Diagnosed Conditions')).toBeInTheDocument();
    expect(screen.getByText('No Conditions diagnosed')).toBeInTheDocument();
    expect(screen.getByText('Allergies')).toBeInTheDocument();
    expect(screen.getByText('Allergic from XYZ')).toBeInTheDocument();
    expect(screen.getByText('Last Consultation With')).toBeInTheDocument();
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
  });

  it('displays disease detection information', () => {
    render(<PatientProfileClinicAdmin />);
    expect(screen.getByText('Detected Disease')).toBeInTheDocument();
    expect(screen.getByText('Onychomycosis')).toBeInTheDocument();
    expect(screen.getByText('Scanned On')).toBeInTheDocument();
    expect(screen.getByText('10/10/2024 09:30 AM')).toBeInTheDocument();
    expect(screen.getByText('Scanned By')).toBeInTheDocument();
    expect(screen.getByText('Self-Scanned')).toBeInTheDocument();
    expect(screen.getByText('Area Affected')).toBeInTheDocument();
    expect(screen.getByText('Thumb Nails')).toBeInTheDocument();
    expect(screen.getByText('Total Possible Conditions')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays progress circles with percentages', () => {
    render(<PatientProfileClinicAdmin />);
    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('renders test reports table with headers', () => {
    render(<PatientProfileClinicAdmin />);
    expect(screen.getByText('Test Type')).toBeInTheDocument();
    expect(screen.getByText('Date Reported')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays test report data', () => {
    render(<PatientProfileClinicAdmin />);
    expect(screen.getByText('CBC Report')).toBeInTheDocument();
    expect(screen.getByText('By Tech. Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('10/10/2024')).toBeInTheDocument();
    expect(screen.getByText('View Report')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<PatientProfileClinicAdmin />);
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('+10 123456789')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('jhondoework@gmail.com')).toBeInTheDocument();
  });

  it('renders table element correctly', () => {
    render(<PatientProfileClinicAdmin />);
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('has correct number of buttons', () => {
    render(<PatientProfileClinicAdmin />);
    const buttons = screen.getAllByRole('button');
    // Contact Patient, Add Appointment, View Report = 3 buttons
    expect(buttons).toHaveLength(3);
  });

  it('displays patient data from hardcoded object', () => {
    render(<PatientProfileClinicAdmin />);
    // Testing that the hardcoded patientData object values are displayed
    expect(screen.getByText('Mr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Accountant at XYZ Company')).toBeInTheDocument();
    expect(screen.getByText('+10 123456789')).toBeInTheDocument();
    expect(screen.getByText('jhondoework@gmail.com')).toBeInTheDocument();
  });
});

/*
Test Coverage Summary:
✅ Component renders without errors
✅ Patient basic info displays (name and occupation)
✅ Patient profile image renders with correct src and alt
✅ Action buttons (Contact Patient, Add Appointment) are present
✅ All section titles render correctly
✅ Medical information details display properly
✅ Disease detection information shows all fields
✅ Progress circles with percentages (98%, 72%, 42%) are visible
✅ Test reports table headers render
✅ Test report sample data displays (CBC Report by Tech. Jane Doe)
✅ Contact information shows phone and email
✅ Table element renders correctly
✅ Correct number of buttons (3 total)
✅ Hardcoded patient data object values display properly
*/