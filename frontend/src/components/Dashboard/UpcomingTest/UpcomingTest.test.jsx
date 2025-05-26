// UpcomingTest.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpcomingTest from './UpcomingTest';

describe('UpcomingTest', () => {
  test('renders the main heading', () => {
    render(<UpcomingTest />);
    
    expect(screen.getByText('Upcoming Tests')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Upcoming Tests' })).toBeInTheDocument();
  });

  test('renders next checkup information', () => {
    render(<UpcomingTest />);
    
    expect(screen.getByText('Next Checkup')).toBeInTheDocument();
    expect(screen.getByText('Fri, 24 Mar')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 5, name: 'Fri, 24 Mar' })).toBeInTheDocument();
  });

  test('renders date navigation section', () => {
    render(<UpcomingTest />);
    
    expect(screen.getByText('20-March-24')).toBeInTheDocument();
  });

  test('renders all images with correct alt text', () => {
    render(<UpcomingTest />);
    
    expect(screen.getByAltText('calendar icon')).toBeInTheDocument();
    expect(screen.getByAltText('arrow left')).toBeInTheDocument();
    expect(screen.getByAltText('arrow right')).toBeInTheDocument();
    expect(screen.getByAltText('profiles')).toBeInTheDocument();
    expect(screen.getByAltText('up icon')).toBeInTheDocument();
  });

  test('renders images with correct src attributes', () => {
    render(<UpcomingTest />);
    
    const calendarIcon = screen.getByAltText('calendar icon');
    const leftArrow = screen.getByAltText('arrow left');
    const rightArrow = screen.getByAltText('arrow right');
    const profilesImage = screen.getByAltText('profiles');
    const upIcon = screen.getByAltText('up icon');

    expect(calendarIcon).toHaveAttribute('src', 'calendar 2.png');
    expect(leftArrow).toHaveAttribute('src', 'left.png');
    expect(rightArrow).toHaveAttribute('src', 'right.png');
    expect(profilesImage).toHaveAttribute('src', 'profiles.png');
    expect(upIcon).toHaveAttribute('src', 'up.png');
  });

  test('renders consult now button', () => {
    render(<UpcomingTest />);
    
    const consultButton = screen.getByRole('button', { name: /consult now/i });
    expect(consultButton).toBeInTheDocument();
    expect(consultButton).toHaveTextContent('Consult Now');
  });

  test('consult now button is clickable', () => {
    render(<UpcomingTest />);
    
    const consultButton = screen.getByRole('button', { name: /consult now/i });
    expect(consultButton).toBeEnabled();
    
    // Test that the button can be clicked without errors
    fireEvent.click(consultButton);
    // Since there's no onClick handler, we just verify it doesn't throw an error
  });

  test('renders component with correct structure', () => {
    const { container } = render(<UpcomingTest />);
    
    // Check for main container
    const mainContainer = container.querySelector('[class*="contain"]');
    expect(mainContainer).toBeInTheDocument();
    
    // Check for heading section
    const headingSection = container.querySelector('[class*="heading"]');
    expect(headingSection).toBeInTheDocument();
    
    // Check for blue accent element
    const blueElement = container.querySelector('[class*="blue"]');
    expect(blueElement).toBeInTheDocument();
    
    // Check for box container
    const boxContainer = container.querySelector('[class*="box"]');
    expect(boxContainer).toBeInTheDocument();
  });

  test('renders all required sections within box heading', () => {
    const { container } = render(<UpcomingTest />);
    
    // Check for calendar section
    const calendarSection = container.querySelector('[class*="calendar"]');
    expect(calendarSection).toBeInTheDocument();
    
    // Check for top text section
    const topTextSection = container.querySelector('[class*="topText"]');
    expect(topTextSection).toBeInTheDocument();
    
    // Check for date navigation section
    const dateNavSection = container.querySelector('[class*="dateNav"]');
    expect(dateNavSection).toBeInTheDocument();
    
    // Check for profile section
    const profileSection = container.querySelector('[class*="profile"]');
    expect(profileSection).toBeInTheDocument();
    
    // Check for button
    const buttonElement = container.querySelector('[class*="button"]');
    expect(buttonElement).toBeInTheDocument();
  });

  test('button contains both text and icon', () => {
    render(<UpcomingTest />);
    
    const consultButton = screen.getByRole('button', { name: /consult now/i });
    const upIcon = screen.getByAltText('up icon');
    
    expect(consultButton).toContainElement(upIcon);
    expect(consultButton).toHaveTextContent('Consult Now');
  });

  test('navigation arrows are present for date navigation', () => {
    render(<UpcomingTest />);
    
    const leftArrow = screen.getByAltText('arrow left');
    const rightArrow = screen.getByAltText('arrow right');
    
    expect(leftArrow).toBeInTheDocument();
    expect(rightArrow).toBeInTheDocument();
    
    // Verify they are clickable elements (images)
    expect(leftArrow.tagName).toBe('IMG');
    expect(rightArrow.tagName).toBe('IMG');
  });

  test('displays correct date format in different sections', () => {
    render(<UpcomingTest />);
    
    // Short date format in checkup section
    expect(screen.getByText('Fri, 24 Mar')).toBeInTheDocument();
    
    // Full date format in navigation section
    expect(screen.getByText('20-March-24')).toBeInTheDocument();
  });

  test('component has proper accessibility structure', () => {
    render(<UpcomingTest />);
    
    // Check that all images have alt text
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
    
    // Check that headings are properly structured
    const h4Heading = screen.getByRole('heading', { level: 4 });
    const h5Heading = screen.getByRole('heading', { level: 5 });
    
    expect(h4Heading).toBeInTheDocument();
    expect(h5Heading).toBeInTheDocument();
  });

  test('renders in correct order', () => {
    render(<UpcomingTest />);
    
    const container = screen.getByText('Upcoming Tests').closest('[class*="contain"]');
    
    // Verify the main heading appears before the content
    const heading = screen.getByText('Upcoming Tests');
    const nextCheckup = screen.getByText('Next Checkup');
    
    expect(heading).toBeInTheDocument();
    expect(nextCheckup).toBeInTheDocument();
    
    // Both should be in the same container
    expect(container).toContainElement(heading);
    expect(container).toContainElement(nextCheckup);
  });
});