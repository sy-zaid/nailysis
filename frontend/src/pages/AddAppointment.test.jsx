import { render, screen } from '@testing-library/react';
import AddAppointment from './AddAppointment';

// Mock the dashboard components
vi.mock('../components/Dashboard/Navbar/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar Component</div>
}));

vi.mock('../components/Dashboard/Header/Header', () => ({
  default: () => <div data-testid="header">Header Component</div>
}));

vi.mock('../components/Dashboard/Sidebar/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Component</div>
}));

describe('AddAppointment', () => {
  test('renders page title and description', () => {
    render(<AddAppointment />);
    
    expect(screen.getByText('Add New Appointment')).toBeInTheDocument();
    expect(screen.getByText('Add a new patient and schedule his/her appointment')).toBeInTheDocument();
  });

  test('renders dashboard components', () => {
    render(<AddAppointment />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  test('renders Patient Information section', () => {
    render(<AddAppointment />);
    
    expect(screen.getByText('Patient Information')).toBeInTheDocument();
    expect(screen.getByText('Load Profile by QR Code')).toBeInTheDocument();
  });

  test('renders patient information form fields', () => {
    render(<AddAppointment />);
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
  });

  test('patient form fields have correct types and placeholders', () => {
    render(<AddAppointment />);
    
    const nameInput = screen.getByLabelText('Name');
    const ageInput = screen.getByLabelText('Age');
    const genderInput = screen.getByLabelText('Gender');
    const phoneInput = screen.getByLabelText('Phone Number');
    
    expect(nameInput).toHaveAttribute('type', 'text');
    expect(nameInput).toHaveAttribute('placeholder', 'John Doe');
    expect(ageInput).toHaveAttribute('type', 'number');
    expect(ageInput).toHaveAttribute('placeholder', '21');
    expect(genderInput).toHaveAttribute('type', 'text');
    expect(genderInput).toHaveAttribute('placeholder', 'Male');
    expect(phoneInput).toHaveAttribute('type', 'tel');
    expect(phoneInput).toHaveAttribute('placeholder', '+92 12345678');
  });

  test('renders Appointment Details section', () => {
    render(<AddAppointment />);
    
    expect(screen.getByText('Appointment Details')).toBeInTheDocument();
  });

  test('renders appointment details form fields', () => {
    render(<AddAppointment />);
    
    expect(screen.getByLabelText('Technician')).toBeInTheDocument();
    expect(screen.getByLabelText('Date & Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Visit Purpose')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Type')).toBeInTheDocument();
  });

  test('appointment details have correct field types', () => {
    render(<AddAppointment />);
    
    const technicianSelect = screen.getByLabelText('Technician');
    const dateTimeInput = screen.getByLabelText('Date & Time');
    const visitPurposeSelect = screen.getByLabelText('Visit Purpose');
    const testTypeSelect = screen.getByLabelText('Test Type');
    
    expect(technicianSelect.tagName).toBe('SELECT');
    expect(dateTimeInput).toHaveAttribute('type', 'datetime-local');
    expect(visitPurposeSelect.tagName).toBe('SELECT');
    expect(testTypeSelect.tagName).toBe('SELECT');
  });

  test('select fields have default options', () => {
    render(<AddAppointment />);
    
    expect(screen.getByText('Dr. Jane Doe')).toBeInTheDocument();
    expect(screen.getAllByText('Lab Test')).toHaveLength(2); // Visit Purpose and Test Type
  });

  test('renders Payment Details section', () => {
    render(<AddAppointment />);
    
    expect(screen.getByText('Payment Details')).toBeInTheDocument();
  });

  test('renders payment details form fields', () => {
    render(<AddAppointment />);
    
    expect(screen.getByLabelText('Discount')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Fee')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount Paid')).toBeInTheDocument();
    expect(screen.getByLabelText('Payment Method')).toBeInTheDocument();
    expect(screen.getByLabelText('Comments')).toBeInTheDocument();
  });

  test('payment fields have correct types and placeholders', () => {
    render(<AddAppointment />);
    
    const testFeeInput = screen.getByLabelText('Test Fee');
    const amountPaidInput = screen.getByLabelText('Amount Paid');
    const commentsTextarea = screen.getByLabelText('Comments');
    
    expect(testFeeInput).toHaveAttribute('type', 'text');
    expect(testFeeInput).toHaveAttribute('placeholder', '5000');
    expect(amountPaidInput).toHaveAttribute('type', 'text');
    expect(amountPaidInput).toHaveAttribute('placeholder', '4000');
    expect(commentsTextarea.tagName).toBe('TEXTAREA');
    expect(commentsTextarea).toHaveAttribute('placeholder', "Payment of PKR 5000 received for Invoice ID 'INV-98765'");
  });

  test('payment select fields have default options', () => {
    render(<AddAppointment />);
    
    expect(screen.getByText('No Discount')).toBeInTheDocument();
    expect(screen.getByText('Cash')).toBeInTheDocument();
  });

  test('renders action buttons', () => {
    render(<AddAppointment />);
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    const confirmButton = screen.getByRole('button', { name: 'Confirm Appointment' });
    
    expect(cancelButton).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
  });

  test('renders QR code button', () => {
    render(<AddAppointment />);
    
    const qrButton = screen.getByRole('button', { name: 'Load Profile by QR Code' });
    expect(qrButton).toBeInTheDocument();
  });

  test('buttons are enabled and clickable', () => {
    render(<AddAppointment />);
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    const confirmButton = screen.getByRole('button', { name: 'Confirm Appointment' });
    const qrButton = screen.getByRole('button', { name: 'Load Profile by QR Code' });
    
    expect(cancelButton).toBeEnabled();
    expect(confirmButton).toBeEnabled();
    expect(qrButton).toBeEnabled();
  });

  test('form inputs have correct CSS classes', () => {
    render(<AddAppointment />);
    
    const nameInput = screen.getByLabelText('Name');
    expect(nameInput.className).toMatch(/inputBox/);
  });

  test('page has correct structure with main containers', () => {
    render(<AddAppointment />);
    
    const container = document.querySelector('[class*="pageContainer"]');
    const pageTop = document.querySelector('[class*="pageTop"]');
    const mainContent = document.querySelector('[class*="mainContent"]');
    const formContainer = document.querySelector('[class*="formContainer"]');
    
    expect(container).toBeInTheDocument();
    expect(pageTop).toBeInTheDocument();
    expect(mainContent).toBeInTheDocument();
    expect(formContainer).toBeInTheDocument();
  });
});

/*
What this test suite covers:

1. Renders page title "Add New Appointment" and description text
2. Renders dashboard components (Navbar, Sidebar) using mocks
3. Renders "Patient Information" section header
4. Renders all patient information form fields (Name, Age, Gender, Phone Number)
5. Verifies patient form fields have correct input types and placeholder values
6. Renders "Appointment Details" section header
7. Renders all appointment details form fields (Technician, Date & Time, Visit Purpose, Test Type)
8. Verifies appointment fields have correct types (select dropdowns, datetime-local input)
9. Verifies select fields contain default options (Dr. Jane Doe, Lab Test)
10. Renders "Payment Details" section header
11. Renders all payment details form fields (Discount, Test Fee, Amount Paid, Payment Method, Comments)
12. Verifies payment fields have correct types, placeholders, and textarea element
13. Verifies payment select fields have default options (No Discount, Cash)
14. Renders action buttons (Cancel, Confirm Appointment)
15. Renders QR code button "Load Profile by QR Code"
16. Verifies all buttons are enabled and clickable
17. Verifies form inputs have correct CSS classes (inputBox)
18. Verifies page has correct structure with main container elements
*/