import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ImageGuide from './ImageGuide';
import styles from './ImageGuide.module.css';

describe('ImageGuide', () => {
  it('renders the main heading', () => {
    const mockOnClose = vi.fn();
    render(<ImageGuide onClose={mockOnClose} />);
    
    expect(screen.getByText('Guide for Accurate Nail Image Diagnosis')).toBeInTheDocument();
  });

  it('renders the description text', () => {
    const mockOnClose = vi.fn();
    render(<ImageGuide onClose={mockOnClose} />);
    
    expect(screen.getByText(/Use the following images as a guide to ensure proper image capture/)).toBeInTheDocument();
  });

  it('renders incorrect way section heading', () => {
    const mockOnClose = vi.fn();
    render(<ImageGuide onClose={mockOnClose} />);
    
    expect(screen.getByText('• Incorrect way of capturing')).toBeInTheDocument();
  });

  it('renders correct way section heading', () => {
    const mockOnClose = vi.fn();
    render(<ImageGuide onClose={mockOnClose} />);
    
    expect(screen.getByText('• Correct way of capturing')).toBeInTheDocument();
  });

  it('renders both guide images with correct alt text', () => {
    const mockOnClose = vi.fn();
    render(<ImageGuide onClose={mockOnClose} />);
    
    expect(screen.getByAltText('Incorrect examples')).toBeInTheDocument();
    expect(screen.getByAltText('Correct examples')).toBeInTheDocument();
  });

  it('renders proceed button', () => {
    const mockOnClose = vi.fn();
    render(<ImageGuide onClose={mockOnClose} />);
    
    expect(screen.getByText('Proceed to Uploading Images')).toBeInTheDocument();
  });

  it('calls onClose when proceed button is clicked', () => {
    const mockOnClose = vi.fn();
    render(<ImageGuide onClose={mockOnClose} />);
    
    const proceedButton = screen.getByText('Proceed to Uploading Images');
    fireEvent.click(proceedButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders modal structure with correct classes', () => {
    const mockOnClose = vi.fn();
    const { container } = render(<ImageGuide onClose={mockOnClose} />);
    
    expect(container.firstChild).toHaveClass(styles.modalContainer);
    expect(container.querySelector(`.${styles.modalContent}`)).toBeInTheDocument();
});
});

/*
Test Coverage Summary:
- ✅ Component renders without crashing
- ✅ Main heading text is displayed
- ✅ Description paragraph is shown
- ✅ Both section headings (incorrect/correct) are rendered
- ✅ Both guide images are present with proper alt attributes
- ✅ Proceed button is rendered
- ✅ onClose callback is triggered when button is clicked
- ✅ Modal structure and CSS classes are applied correctly
*/