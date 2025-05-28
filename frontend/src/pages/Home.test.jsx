import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Home from './Home';
import styles from './Home.module.css';

// Mock ScrollReveal
vi.mock('scrollreveal', () => ({
  default: vi.fn(() => ({
    reveal: vi.fn()
  }))
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Wrapper component for Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

 
  test('renders search input in navigation', () => {
    renderWithRouter(<Home />);
    const searchInput = screen.getByPlaceholderText('Search');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  test('renders hero section content', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('An Expert')).toBeInTheDocument();
    expect(screen.getByText('Diagnosis System')).toBeInTheDocument();
    expect(screen.getByText(/Simply upload a photo, and our smart diagnostic tool/)).toBeInTheDocument();
  });

  test('renders hero section buttons', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Scan Nail Health')).toBeInTheDocument();
    expect(screen.getByText('Book an Appointment')).toBeInTheDocument();
  });

  test('renders hero image cards with text', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    expect(screen.getByText('Nail Disease Detection')).toBeInTheDocument();
    expect(screen.getByText('Easy to Use')).toBeInTheDocument();
    expect(screen.getByText('AI Diagnosis')).toBeInTheDocument();
  });

  test('renders hero main image', () => {
    renderWithRouter(<Home />);
    const heroImage = screen.getByAltText('Hero Image');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', 'hero-header.png');
  });

  test('renders feature section heading', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Fast. Accurate. Scalable.')).toBeInTheDocument();
  });

  test('renders feature cards with statistics', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Analyzed Nail Images')).toBeInTheDocument();
    expect(screen.getByText('20,549')).toBeInTheDocument();
    expect(screen.getByText('Results Accuracy')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('Time Consumption')).toBeInTheDocument();
    expect(screen.getByText('3x Faster')).toBeInTheDocument();
    expect(screen.getByText('Data security')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });

  test('renders service section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Our Services')).toBeInTheDocument();
    expect(screen.getByText('Consult a Doctor')).toBeInTheDocument();
    expect(screen.getByText('Medical Appointments')).toBeInTheDocument();
    expect(screen.getByText('AI Technology')).toBeInTheDocument();
    expect(screen.getByText('24/7 Online Support')).toBeInTheDocument();
  });

  test('renders how it works section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('How it')).toBeInTheDocument();
    expect(screen.getByText('works?')).toBeInTheDocument();
    expect(screen.getByText('Capture And Upload')).toBeInTheDocument();
    expect(screen.getByText('AI Analysis')).toBeInTheDocument();
    expect(screen.getByText('Get Results & Insights')).toBeInTheDocument();
  });

  test('renders parallax section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Why Choose Nailysis?')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Accuracy')).toBeInTheDocument();
    expect(screen.getByText(/Our AI-powered system analyzes nail images/)).toBeInTheDocument();
  });

  test('renders footer content', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Socials')).toBeInTheDocument();
    expect(screen.getByText('Tel: 021 12345678')).toBeInTheDocument();
    expect(screen.getByText('Mail: Nailysis@gmail.com')).toBeInTheDocument();
  });

  test('renders footer social media links', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });

  test('renders copyright section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('© 2025 Nailysis. All rights reserved.')).toBeInTheDocument();
  });

  test('renders email subscription input', () => {
    renderWithRouter(<Home />);
    const emailInput = screen.getByPlaceholderText('Enter your email here');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'text');
  });

  // Add at the top of the file
 
  
  test('mobile menu toggle functionality', () => {
    renderWithRouter(<Home />);
    const menuBtn = screen.getByTestId('menu-btn');
    expect(menuBtn).toBeInTheDocument();
    
    fireEvent.click(menuBtn);
    const navLinks = screen.getByTestId('nav-links');
    expect(navLinks).toBeInTheDocument();
    // Check for the CSS module class
    expect(navLinks.classList.contains(styles.open)).toBe(true);
  });

  test('navigation links are properly rendered as Link components', () => {
    renderWithRouter(<Home />);
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const appointmentLink = screen.getByRole('link', { name: 'Book An Appointment' });
    const aboutLink = screen.getByRole('link', { name: 'About' });
    const contactLink = screen.getByRole('link', { name: 'Contact Us' });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(appointmentLink).toHaveAttribute('href', '/login');
    expect(aboutLink).toHaveAttribute('href', '/about-us');
    expect(contactLink).toHaveAttribute('href', '/contact-us');
  });

  test('renders all doctor images', () => {
    renderWithRouter(<Home />);
    const doctorImages = screen.getAllByAltText('');
    const doctorImagesFiltered = doctorImages.filter(img => 
      img.src.includes('doctor-') || 
      img.src.includes('stethoscope.png') || 
      img.src.includes('hand.png') ||
      img.src.includes('about-us.png') ||
      img.src.includes('feature-section.png')
    );
    expect(doctorImagesFiltered.length).toBeGreaterThan(0);
  });

  test('has proper semantic structure', () => {
    renderWithRouter(<Home />);
    expect(document.querySelector('header')).toBeInTheDocument();
    expect(document.querySelector('nav')).toBeInTheDocument();
    expect(document.querySelector('main')).toBeInTheDocument();
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});