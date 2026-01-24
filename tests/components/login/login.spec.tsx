import { render, screen } from "@testing-library/react"

import LoginComponent from "../../../src/components/login"

describe("Login Component", () => {
  it("should render login compinent", () => {
    render(<LoginComponent />)

    expect(screen.getByText("Login")).toBeInTheDocument()
  })
})
