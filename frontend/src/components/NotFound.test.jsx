import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFound from "./NotFound";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

describe("NotFound Component", () => {
  test("renders 404 message and button", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    expect(screen.getByText(/404 \| Page not found/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to homepage/i })).toBeInTheDocument();
  });

  test("button click triggers navigation", () => {
    const navigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockImplementation(() => navigate);
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /go to homepage/i }));
    expect(navigate).toHaveBeenCalledWith("/dashboard");
  });
});