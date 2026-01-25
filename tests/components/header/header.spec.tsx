import { fireEvent, render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Header } from "@/components/header"
import { ButtonTypeEnum } from "@/types"

jest.mock("@/firebase.config", () => ({
  auth: {
    currentUser: { uid: "123", displayName: "Usuário Teste" },
    onAuthStateChanged: jest.fn((callback) => {
      callback({ uid: "123", displayName: "Usuário Teste" })
      return () => {}
    }),
  },
}))

jest.mock("@/services/auth.service", () => ({
  AuthService: {
    login: jest.fn(),
    logout: jest.fn(),
  },
}))

jest.mock("next/navigation")

const mockSignOut = jest.fn(() => Promise.resolve())
jest.mock("@/services/auth.service", () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    signOut: mockSignOut,
  })),
}))

describe("Header", () => {
  it("should render exit icon button", () => {
    const { getByTestId } = render(<Header />)

    expect(getByTestId("exit-button")).toBeInTheDocument()
  })

  it("should call signOut and redirect to login when exit button is clicked", async () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })

    const { getByTestId } = render(<Header />)

    const exitButton = getByTestId("exit-button")

    fireEvent.click(exitButton)

    expect(mockSignOut).toHaveBeenCalled()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login")
    })
  })

  it("should render filter button if page is Home", () => {
    const page = "Home"
    const { getByTestId } = render(<Header page={page} />)

    expect(getByTestId("filter-button")).toBeInTheDocument()
  })

  it("should not render filter button if page is not Home", () => {
    const page = "Profile"
    const { queryByTestId } = render(<Header page={page} />)

    expect(queryByTestId("filter-button")).not.toBeInTheDocument()
  })

  it("should render menu when filter button is clicked", () => {
    const TestWrapper = () => {
      const [active, setActive] = useState<ButtonTypeEnum | null>(null)
      return (
        <Header
          page="Home"
          activePopup={active}
          setActivePopUp={() => setActive(ButtonTypeEnum.FILTER)}
        />
      )
    }

    const { getByTestId, getByText } = render(<TestWrapper />)

    fireEvent.click(getByTestId("filter-button"))

    expect(getByText("Gêneros")).toBeInTheDocument()
  })

  it("should render pop up menu with genders options", () => {
    const page = "Home"
    const genres = [
      { id: "1", name: "Suspense" },
      { id: "2", name: "Aventura" },
      { id: "3", name: "Drama" },
    ]

    const { getByText } = render(
      <Header page={page} activePopup={"filter"} genres={genres} />,
    )

    expect(getByText("Gêneros")).toBeInTheDocument()
    expect(getByText("Drama")).toBeInTheDocument()
    expect(getByText("Suspense")).toBeInTheDocument()
    expect(getByText("Aventura")).toBeInTheDocument()
  })

  it("should render call onSelectGenre on click on gender name", () => {
    const page = "Home"
    const genres = [
      { id: "1", name: "Suspense" },
      { id: "2", name: "Aventura" },
      { id: "3", name: "Drama" },
    ]
    const onSelectGenre = jest.fn()

    const { getByText } = render(
      <Header
        page={page}
        activePopup={"filter"}
        genres={genres}
        onSelectGenre={onSelectGenre}
      />,
    )

    const dramaGenre = getByText("Drama")
    fireEvent.click(dramaGenre)

    expect(onSelectGenre).toHaveBeenCalled()
  })

  it("should render input selected", () => {
    const page = "Home"
    const genres = [{ id: "3", name: "Drama" }]
    const onSelectGenre = jest.fn()
    const selectedGenres = ["3"]

    const { getByRole } = render(
      <Header
        page={page}
        activePopup={"filter"}
        genres={genres}
        onSelectGenre={onSelectGenre}
        selectedGenres={selectedGenres}
      />,
    )
    const checkbox = getByRole("checkbox")
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toBeChecked()
  })

  it("should render filter button", () => {
    const page = "Home"
    const setActivePopUpMock = jest.fn()

    const { getByTestId } = render(
      <Header page={page} setActivePopUp={setActivePopUpMock} />,
    )

    const filterButton = getByTestId("filter-button")

    fireEvent.click(filterButton)

    expect(setActivePopUpMock).toHaveBeenCalledTimes(1)
  })

  it("should render the input placeholder if page is Home", () => {
    const page = "Home"
    const { getByPlaceholderText } = render(<Header page={page} />)

    expect(getByPlaceholderText("Buscar...")).toBeInTheDocument()
  })

  it("should render the image", () => {
    const page = "Home"
    const { getByRole } = render(<Header page={page} />)

    expect(getByRole("img")).toBeInTheDocument()
  })

  it("should render the text typed in the input", async () => {
    const page = "Home"
    const setSearch = jest.fn()
    const { getByRole } = render(<Header page={page} setSearch={setSearch} />)

    const userInteraction = userEvent.setup()

    const searchInput = getByRole("searchbox")

    await userInteraction.type(searchInput, "Batatas")
    expect(setSearch).toHaveBeenCalledTimes(7)
  })
})
