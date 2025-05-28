import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DoctorProfile from './doctor-profile-clinic-admin';
// Mock CSS modules
vi.mock('./doctor-profile-clinic-admin.module.css', () => ({
  default: {
    container: 'container',
    header: 'header',
    doctorImage: 'doctorImage',
    headerInfo: 'headerInfo',
    buttons: 'buttons',
    contactBtn: 'contactBtn',
    appointmentBtn: 'appointmentBtn',
    about: 'about',
    section: 'section',
    socialMedia: 'socialMedia',
    icons: 'icons',
    photoGallery: 'photoGallery',
    gallery: 'gallery',
    links: 'links',
    contactInfo: 'contactInfo',
    contactItems: 'contactItems'
  }
}));

describe('DoctorProfile', () => {
  it('renders without crashing', () => {
    render(<DoctorProfile />);
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
  });

  it('displays doctor basic information', () => {
    render(<DoctorProfile />);
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Consultant at XYZ Hospital')).toBeInTheDocument();
    expect(screen.getByText('North Nazimabad, Karachi')).toBeInTheDocument();
  });

  it('renders doctor profile image with correct alt text', () => {
    render(<DoctorProfile />);
    const doctorImage = screen.getByAltText('Doctor');
    expect(doctorImage).toBeInTheDocument();
    expect(doctorImage).toHaveAttribute('src', '/doctor.png');
  });

  it('displays action buttons', () => {
    render(<DoctorProfile />);
    expect(screen.getByText('Contact Doctor')).toBeInTheDocument();
    expect(screen.getByText('Book Appointment')).toBeInTheDocument();
  });

  it('renders all section headings', () => {
    render(<DoctorProfile />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('My Story')).toBeInTheDocument();
    expect(screen.getByText('Why Choose John Doe?')).toBeInTheDocument();
    expect(screen.getByText('Social Media')).toBeInTheDocument();
    expect(screen.getByText('Photo Gallery')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('Contact Info')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<DoctorProfile />);
    expect(screen.getByText('Phone: +10 123456789')).toBeInTheDocument();
    expect(screen.getByText('Email: johndoeemail@gmail.com')).toBeInTheDocument();
  });

  it('renders all social media icons with correct alt text', () => {
    render(<DoctorProfile />);
    expect(screen.getByAltText('Gmail')).toBeInTheDocument();
    expect(screen.getByAltText('Facebook')).toBeInTheDocument();
    expect(screen.getByAltText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByAltText('Behance')).toBeInTheDocument();
    expect(screen.getByAltText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByAltText('Instagram')).toBeInTheDocument();
  });

  it('renders photo gallery images', () => {
    render(<DoctorProfile />);
    expect(screen.getByAltText('Gallery 1')).toBeInTheDocument();
    expect(screen.getByAltText('Gallery 2')).toBeInTheDocument();
    expect(screen.getByAltText('Gallery 3')).toBeInTheDocument();
  });

  it('displays links section content', () => {
    render(<DoctorProfile />);
    const linkTexts = screen.getAllByText('The Importance of Scheduling Early');
    expect(linkTexts).toHaveLength(2);
  });

  it('has correct number of images total', () => {
    render(<DoctorProfile />);
    const allImages = screen.getAllByRole('img');
    // 1 doctor image + 6 social media icons + 3 gallery images = 10 total
    expect(allImages).toHaveLength(10);
  });

  it('renders About section with lorem ipsum content', () => {
    render(<DoctorProfile />);
    expect(screen.getByText(/Lorem ipsum dolor, sit amet consectetur adipisicing elit/)).toBeInTheDocument();
  });
});

/*
Test Coverage Summary:
✅ Component renders without errors
✅ Doctor basic info displays (name, hospital, location)
✅ Doctor profile image renders with correct src and alt
✅ Action buttons (Contact Doctor, Book Appointment) are present
✅ All section headings render correctly
✅ Contact information (phone and email) displays
✅ All 6 social media icons render with proper alt text
✅ All 3 photo gallery images render
✅ Links section content appears (duplicate text entries)
✅ Total image count is correct (10 images)
✅ About section lorem ipsum content is present
*/