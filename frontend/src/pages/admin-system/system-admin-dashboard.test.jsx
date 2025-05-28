import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import SystemAdminDashboard from './system-admin-dashboard';

// Mock window.location.href
delete window.location;
window.location = { href: '' };

// Wrapper component for router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('SystemAdminDashboard', () => {
  beforeEach(() => {
    // Reset window.location.href before each test
    window.location.href = '';
  });

  test('renders without crashing', () => {
    render(
      <RouterWrapper>
        <SystemAdminDashboard />
      </RouterWrapper>
    );
    
    // Component should render (even though it returns null)
    expect(true).toBe(true);
  });

  test('returns null (renders nothing)', () => {
    const { container } = render(
      <RouterWrapper>
        <SystemAdminDashboard />
      </RouterWrapper>
    );
    
    // Component should render nothing
    expect(container.firstChild).toBeNull();
  });

  test('redirects to Django admin URL on mount', () => {
    render(
      <RouterWrapper>
        <SystemAdminDashboard />
      </RouterWrapper>
    );
    
    // Should redirect to the Django admin URL
    expect(window.location.href).toBe('http://127.0.0.1:8000/admin');
  });

  test('redirects immediately without delay', () => {
    const startTime = Date.now();
    
    render(
      <RouterWrapper>
        <SystemAdminDashboard />
      </RouterWrapper>
    );
    
    const endTime = Date.now();
    
    // Should redirect immediately (within reasonable time)
    expect(endTime - startTime).toBeLessThan(100);
    expect(window.location.href).toBe('http://127.0.0.1:8000/admin');
  });

  test('redirect behavior works correctly', () => {
    render(
      <RouterWrapper>
        <SystemAdminDashboard />
      </RouterWrapper>
    );
    
    // The redirect should happen and window.location.href should be set
    expect(window.location.href).toBe('http://127.0.0.1:8000/admin');
  });

  test('component does not render any visible content', () => {
    const { container } = render(
      <RouterWrapper>
        <SystemAdminDashboard />
      </RouterWrapper>
    );
    
    // Should have no text content
    expect(container.textContent).toBe('');
    
    // Should have no child elements
    expect(container.children).toHaveLength(0);
  });

  test('multiple renders redirect consistently', () => {
    // First render
    const { unmount } = render(
      <RouterWrapper>
        <SystemAdminDashboard />
      </RouterWrapper>
    );
    
    expect(window.location.href).toBe('http://127.0.0.1:8000/admin');
    
    // Reset and render again
    unmount();
    window.location.href = '';
    
    render(
      <RouterWrapper>
        <SystemAdminDashboard />
      </RouterWrapper>
    );
    
    // Should redirect again
    expect(window.location.href).toBe('http://127.0.0.1:8000/admin');
  });

  test('component exports correctly', () => {
    expect(SystemAdminDashboard).toBeDefined();
    expect(typeof SystemAdminDashboard).toBe('function');
  });
});

/*
Test Coverage Summary:
- ✅ Component renders without crashing
- ✅ Returns null (no visible content)
- ✅ Redirects to correct Django admin URL
- ✅ Redirect happens immediately on mount
- ✅ Redirect behavior works correctly
- ✅ No visible content is rendered
- ✅ Multiple renders work consistently
- ✅ Component is properly exported
- ✅ Router compatibility (wrapped in BrowserRouter)
*/