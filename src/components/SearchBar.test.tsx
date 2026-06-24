import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  it("renders search input, search button, and placeholder text", () => {
    render(
      <SearchBar
        onSearch={() => {}}
        isLoading={false}
        recentSearches={[]}
      />
    );

    const input = screen.getByPlaceholderText(/search city/i);
    const button = screen.getByRole("button", { name: /search/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("calls onSearch with input value when form is submitted", () => {
    const handleSearch = vi.fn();
    render(
      <SearchBar
        onSearch={handleSearch}
        isLoading={false}
        recentSearches={[]}
      />
    );

    const input = screen.getByPlaceholderText(/search city/i);
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "London" } });
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith("London");
  });

  it("renders error message when error prop is provided", () => {
    render(
      <SearchBar
        onSearch={() => {}}
        isLoading={false}
        error="City not found"
        recentSearches={[]}
      />
    );

    const errorMsg = screen.getByText("City not found");
    expect(errorMsg).toBeInTheDocument();
  });

  it("renders recent searches and triggers onSearch when clicked", () => {
    const handleSearch = vi.fn();
    const recent = ["Paris", "Tokyo"];

    render(
      <SearchBar
        onSearch={handleSearch}
        isLoading={false}
        recentSearches={recent}
      />
    );

    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("Tokyo")).toBeInTheDocument();

    const parisButton = screen.getByRole("button", { name: "Paris" });
    fireEvent.click(parisButton);

    expect(handleSearch).toHaveBeenCalledWith("Paris");
  });
});
