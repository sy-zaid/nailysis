import { render, screen } from '@testing-library/react';
import SocialLogin from './SocialLogin';

describe('SocialLogin', () => {
  test('renders the social login container', () => {
    render(<SocialLogin />);
    
    const container = document.querySelector('[class*="socialLogin"]');
    expect(container).toBeInTheDocument();
  });

  test('renders Google login button', () => {
    render(<SocialLogin />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    expect(googleButton).toBeInTheDocument();
  });

  test('renders Facebook login button', () => {
    render(<SocialLogin />);
    
    const facebookButton = screen.getByRole('button', { name: /continue with facebook/i });
    expect(facebookButton).toBeInTheDocument();
  });

  test('Google button contains correct image', () => {
    render(<SocialLogin />);
    
    const googleImage = screen.getByAltText('Google');
    expect(googleImage).toBeInTheDocument();
    expect(googleImage).toHaveAttribute('src', 'google.png');
  });

  test('Facebook button contains correct image', () => {
    render(<SocialLogin />);
    
    const facebookImage = screen.getByAltText('Facebook');
    expect(facebookImage).toBeInTheDocument();
    expect(facebookImage).toHaveAttribute('src', 'facebook.png');
  });

  test('Google button has correct text content', () => {
    render(<SocialLogin />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    expect(googleButton).toHaveTextContent('Continue With Google');
  });

  test('Facebook button has correct text content', () => {
    render(<SocialLogin />);
    
    const facebookButton = screen.getByRole('button', { name: /continue with facebook/i });
    expect(facebookButton).toHaveTextContent('Continue With Facebook');
  });

  test('Google button has correct CSS classes', () => {
    render(<SocialLogin />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    expect(googleButton.className).toMatch(/socialButton/);
    expect(googleButton.className).toMatch(/googleButton/);
  });

  test('Facebook button has correct CSS classes', () => {
    render(<SocialLogin />);
    
    const facebookButton = screen.getByRole('button', { name: /continue with facebook/i });
    expect(facebookButton.className).toMatch(/socialButton/);
    expect(facebookButton.className).toMatch(/facebookButton/);
  });

  test('images have correct CSS classes', () => {
    render(<SocialLogin />);
    
    const googleImage = screen.getByAltText('Google');
    const facebookImage = screen.getByAltText('Facebook');
    
    expect(googleImage.className).toMatch(/socialIcon/);
    expect(facebookImage.className).toMatch(/socialIcon/);
  });

  test('both buttons are clickable', () => {
    render(<SocialLogin />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    const facebookButton = screen.getByRole('button', { name: /continue with facebook/i });
    
    expect(googleButton).toBeEnabled();
    expect(facebookButton).toBeEnabled();
  });

  test('buttons contain span elements with text', () => {
    render(<SocialLogin />);
    
    const googleSpan = screen.getByText('Continue With Google');
    const facebookSpan = screen.getByText('Continue With Facebook');
    
    expect(googleSpan.tagName).toBe('SPAN');
    expect(facebookSpan.tagName).toBe('SPAN');
  });
});

/*
What this test suite covers:

1. Renders the social login container div
2. Renders Google login button with proper role
3. Renders Facebook login button with proper role
4. Google button contains image with correct src and alt attributes
5. Facebook button contains image with correct src and alt attributes
6. Google button has correct text content ("Continue With Google")
7. Facebook button has correct text content ("Continue With Facebook")
8. Google button has correct CSS classes (socialButton and googleButton)
9. Facebook button has correct CSS classes (socialButton and facebookButton)
10. Both images have correct CSS class (socialIcon)
11. Both buttons are enabled and clickable
12. Button text is wrapped in span elements as expected
*/