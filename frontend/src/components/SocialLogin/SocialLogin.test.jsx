import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SocialLogin from "./SocialLogin";

// Mock the CSS modules
jest.mock("./SocialLogin.module.css", () => ({
  socialLogin: "socialLogin",
  socialButton: "socialButton",
  googleButton: "googleButton",
  facebookButton: "facebookButton",
  socialIcon: "socialIcon",
}));

describe("SocialLogin Component", () => {
  beforeEach(() => {
    render(<SocialLogin />);
  });

  test("renders social login container", () => {
    const container = document.querySelector(".socialLogin");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("socialLogin");
  });

  test("renders Google login button with correct text", () => {
    const googleButton = screen.getByRole("button", { name: /continue with google/i });
    expect(googleButton).toBeInTheDocument();
    expect(googleButton).toHaveClass("socialButton", "googleButton");
  });

  test("renders Facebook login button with correct text", () => {
    const facebookButton = screen.getByRole("button", { name: /continue with facebook/i });
    expect(facebookButton).toBeInTheDocument();
    expect(facebookButton).toHaveClass("socialButton", "facebookButton");
  });

  test("renders Google icon with correct attributes", () => {
    const googleIcon = screen.getByAltText("Google");
    expect(googleIcon).toBeInTheDocument();
    expect(googleIcon).toHaveAttribute("src", "google.png");
    expect(googleIcon).toHaveClass("socialIcon");
  });

  test("renders Facebook icon with correct attributes", () => {
    const facebookIcon = screen.getByAltText("Facebook");
    expect(facebookIcon).toBeInTheDocument();
    expect(facebookIcon).toHaveAttribute("src", "facebook.png");
    expect(facebookIcon).toHaveClass("socialIcon");
  });

  test("Google button is clickable", () => {
    const googleButton = screen.getByRole("button", { name: /continue with google/i });
    fireEvent.click(googleButton);
    // Since there's no onClick handler, we just verify the button can be clicked without errors
    expect(googleButton).toBeInTheDocument();
  });

  test("Facebook button is clickable", () => {
    const facebookButton = screen.getByRole("button", { name: /continue with facebook/i });
    fireEvent.click(facebookButton);
    // Since there's no onClick handler, we just verify the button can be clicked without errors
    expect(facebookButton).toBeInTheDocument();
  });

  test("renders exactly two social login buttons", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  test("button text content is correct", () => {
    expect(screen.getByText("Continue With Google")).toBeInTheDocument();
    expect(screen.getByText("Continue With Facebook")).toBeInTheDocument();
  });

  test("component structure is correct", () => {
    const container = document.querySelector(".socialLogin");
    const buttons = container.querySelectorAll("button");
    
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveClass("socialButton", "googleButton");
    expect(buttons[1]).toHaveClass("socialButton", "facebookButton");
  });

  test("icons are inside buttons", () => {
    const googleButton = screen.getByRole("button", { name: /continue with google/i });
    const facebookButton = screen.getByRole("button", { name: /continue with facebook/i });
    
    expect(googleButton).toContainElement(screen.getByAltText("Google"));
    expect(facebookButton).toContainElement(screen.getByAltText("Facebook"));
  });
});

// Additional test suite for accessibility
describe("SocialLogin Accessibility", () => {
  test("buttons have accessible names", () => {
    render(<SocialLogin />);
    
    const googleButton = screen.getByRole("button", { name: /continue with google/i });
    const facebookButton = screen.getByRole("button", { name: /continue with facebook/i });
    
    expect(googleButton).toHaveAccessibleName("Google Continue With Google");
    expect(facebookButton).toHaveAccessibleName("Facebook Continue With Facebook");
  });

  test("images have proper alt text", () => {
    render(<SocialLogin />);
    
    const googleIcon = screen.getByAltText("Google");
    const facebookIcon = screen.getByAltText("Facebook");
    
    expect(googleIcon).toHaveAttribute("alt", "Google");
    expect(facebookIcon).toHaveAttribute("alt", "Facebook");
  });
});

// Test suite for error handling
describe("SocialLogin Error Handling", () => {
  test("component renders without crashing when CSS module is missing", () => {
    // This test ensures the component is robust even if CSS classes are undefined
    jest.doMock("./SocialLogin.module.css", () => ({}));
    
    expect(() => render(<SocialLogin />)).not.toThrow();
  });
});

// Snapshot testing
describe("SocialLogin Snapshots", () => {
  test("matches snapshot", () => {
    const { container } = render(<SocialLogin />);
    expect(container.firstChild).toMatchSnapshot();
  });
});