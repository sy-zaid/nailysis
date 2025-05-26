import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterForm from "./RegisterForm";
import { BrowserRouter } from "react-router-dom";
import api from "../../api";

// Mock dependencies
jest.mock("../../api");
const mockApi = api;

// Mock CSS modules
jest.mock("./Form.module.css", () => ({
  form: "form",
  main: "main",
  scrollablediv: "scrollablediv",
  inputRow: "inputRow",
  inputGroup: "inputGroup",
  halfWidth: "halfWidth",
  radioGroup: "radioGroup",
  submitButton: "submitButton",
}));

// Mock SocialLogin component
jest.mock("../SocialLogin/SocialLogin", () => {
  return function MockSocialLogin() {
    return <div data-testid="social-login">Social Login Component</div>;
  };
});

// Define the mock object with 'mock' prefix
const mockToast = {
  warning: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
};

// Use the mock in the module factory
jest.mock("react-toastify", () => ({
  toast: () => mockToast // Return a function that returns the mock
}));

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RegisterForm", () => {
  const setup = () =>
    render(
      <BrowserRouter>
        <RegisterForm route="/register" />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.post.mockResolvedValue({ data: { success: true } });
  });

  it("renders all input fields", () => {
    setup();

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Male/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Female/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Other/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prefer Not to Say/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Emergency Contact/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("renders form title and social login component", () => {
    setup();

    expect(screen.getByText("Create Your Account")).toBeInTheDocument();
    expect(screen.getByTestId("social-login")).toBeInTheDocument();
    expect(screen.getByText("or")).toBeInTheDocument();
  });

  it("shows validation warning for empty first name", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock.warning).toHaveBeenCalledWith("First name is required.");
    });
  });

  it("shows validation warning for empty last name", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock.warning).toHaveBeenCalledWith("Last name is required.");
    });
  });

  it("shows validation warning for empty email", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock.warning).toHaveBeenCalledWith("Email is required.");
    });
  });

  it("shows warning if passwords do not match", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "2000-01-01" } });
    fireEvent.click(screen.getByRole('radio', { name: /^male$/i }));
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact/i), { target: { value: "03001234568" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "differentpass" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock.warning).toHaveBeenCalledWith("Passwords do not match!");
    });
  });

  it("shows warning for invalid email format", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid-email" } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "2000-01-01" } });
    fireEvent.click(screen.getByRole('radio', { name: /^male$/i }));
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact/i), { target: { value: "03001234568" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock.warning).toHaveBeenCalledWith("Enter a valid email address. name@example.com");
    });
  });

  it("shows warning for invalid phone number", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "123" } }); // Invalid phone
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "2000-01-01" } });
    fireEvent.click(screen.getByRole('radio', { name: /^male$/i }));
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact/i), { target: { value: "03001234568" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock.warning).toHaveBeenCalledWith("Enter a valid phone number. 03001234567");
    });
  });

  it("shows warning for invalid name containing numbers", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John123" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "2000-01-01" } });
    fireEvent.click(screen.getByRole('radio', { name: /^male$/i }));
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact/i), { target: { value: "03001234568" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock.warning).toHaveBeenCalledWith("Names should only contain letters");
    });
  });

  it("shows warning for short password", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "2000-01-01" } });
   fireEvent.click(screen.getByRole('radio', { name: /^male$/i }));
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact/i), { target: { value: "03001234568" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123" } }); // Short password
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "123" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock.warning).toHaveBeenCalledWith("Password must be at least 8 characters long.");
    });
  });

  it("submits the form with valid data and navigates to login", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "2000-01-01" } });
   fireEvent.click(screen.getByRole('radio', { name: /^male$/i }));
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact/i), { target: { value: "03001234568" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith("/register", {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
        phone: "03001234567",
        role: "patient",
        date_of_birth: "2000-01-01",
        gender: "M",
        address: "123 Main St",
        emergency_contact: "03001234568"
      });
      expect(toastMock.success).toHaveBeenCalledWith("Registration Successful!", {
        className: "custom-toast",
      });
      expect(mockedNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("handles API error response", async () => {
    mockApi.post.mockRejectedValue({
      response: { data: { error: "User already exists" } }
    });

    setup();

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "2000-01-01" } });
   fireEvent.click(screen.getByRole('radio', { name: /^male$/i }));
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact/i), { target: { value: "03001234568" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith("User already exists", {
        className: "custom-toast",
      });
    });
  });

  it("handles network error", async () => {
    mockApi.post.mockRejectedValue(new Error("Network Error"));

    setup();

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "2000-01-01" } });
   fireEvent.click(screen.getByRole('radio', { name: /^male$/i }));
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact/i), { target: { value: "03001234568" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith("Network Error");
    });
  });

  it("can select different gender options", () => {
    setup();

    const maleRadio = screen.getByRole('radio', { name: /male/i });
    const femaleRadio = screen.getByRole('radio', { name: /female/i });
    const otherRadio = screen.getByRole('radio', { name: /other/i });
    const preferNotToSayRadio = screen.getByRole('radio', { name: /prefer not to say/i });

    fireEvent.click(femaleRadio);
    expect(femaleRadio).toBeChecked();
    expect(maleRadio).not.toBeChecked();

    fireEvent.click(otherRadio);
    expect(otherRadio).toBeChecked();
    expect(femaleRadio).not.toBeChecked();

    fireEvent.click(preferNotToSayRadio);
    expect(preferNotToSayRadio).toBeChecked();
    expect(otherRadio).not.toBeChecked();
  });

  it("updates input values correctly", () => {
    setup();

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const addressInput = screen.getByLabelText(/Address/i);

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(addressInput, { target: { value: "123 Main Street" } });

    expect(firstNameInput.value).toBe("John");
    expect(emailInput.value).toBe("john@example.com");
    expect(addressInput.value).toBe("123 Main Street");
  });
});

// Accessibility tests
describe("RegisterForm Accessibility", () => {
  const setup = () =>
    render(
      <BrowserRouter>
        <RegisterForm route="/register" />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has proper form structure", () => {
    setup();

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute("class", "form-container");
  });

  it("has proper input labels", () => {
    setup();

    // Check that all inputs have associated labels
    const inputs = screen.getAllByRole("textbox");
    const passwordInputs = screen.getAllByLabelText(/password/i);
    const radioInputs = screen.getAllByRole("radio");
    const dateInput = screen.getByLabelText(/date of birth/i);

    inputs.forEach(input => {
      expect(input).toHaveAccessibleName();
    });

    passwordInputs.forEach(input => {
      expect(input).toHaveAccessibleName();
    });

    radioInputs.forEach(input => {
      expect(input).toHaveAccessibleName();
    });

    expect(dateInput).toHaveAccessibleName();
  });

  it("radio buttons have proper grouping", () => {
    setup();

    const genderRadios = screen.getAllByRole("radio");
    genderRadios.forEach(radio => {
      expect(radio).toHaveAttribute("name", "gender");
    });
  });
});

// Snapshot test
describe("RegisterForm Snapshots", () => {
  it("matches snapshot", () => {
    const { container } = render(
      <BrowserRouter>
        <RegisterForm route="/register" />
      </BrowserRouter>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});