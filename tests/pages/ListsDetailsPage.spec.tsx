/* eslint-disable prettier/prettier */
import { fireEvent, render } from "@testing-library/react"

import ListsDetailsPage from "@/app/(private)/lists/[listId]/page"
import { useList } from "@/hooks/use-list"
import { useTvShow } from "@/hooks/use-tv-shows"

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
  AuthService: jest.fn().mockImplementation(() => ({
    signOut: jest.fn().mockResolvedValue(undefined),
  })),
}))

const defaultUseList = {
  lists: [
    {
      id: "123",
      title: "Minha Lista",
      tvShows: [{ id: "dorama-1", title: "Pousando no Amor" }],
    },
  ],
  removeTvShowFromTheList: jest.fn(),
  updateListOrder: jest.fn(),
}

const defaultUseTvShow = {
  watchedTvShows: [],
  markTvShowAsWatched: jest.fn(),
  removeTvShowFromWatched: jest.fn(),
}
jest.mock("@/hooks/use-list", () => ({ useList: jest.fn() }))
jest.mock("@/hooks/use-tv-shows", () => ({ useTvShow: jest.fn() }))

jest.mock("next/navigation", () => ({
  useParams: () => ({
    listId: "123",
  }),
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/lists/123",
}))

describe("ListsDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useList as jest.Mock).mockReturnValue({ ...defaultUseList })
    ;(useTvShow as jest.Mock).mockReturnValue({ ...defaultUseTvShow })
  })

  it("should render message informing that does not exists item on the list", () => {
    ;(useList as jest.Mock).mockReturnValue({
      ...defaultUseList,
      lists: [],
    })
    const { getByText } = render(<ListsDetailsPage />)

    expect(
      getByText("Não existe nenhum dorama na sua lista!"),
    ).toBeInTheDocument()
  })

  it("should render buttons", () => {
    const { getByTestId } = render(<ListsDetailsPage />)

    expect(getByTestId("eye-button")).toBeInTheDocument()
    expect(getByTestId("trash-button")).toBeInTheDocument()
  })

  it("should call removeTvShowFromTheList on click on trash button", () => {
    const { getByTestId } = render(<ListsDetailsPage />)
    const trashIcon = getByTestId("trash-button")
    fireEvent.click(trashIcon)
    expect(defaultUseList.removeTvShowFromTheList).toHaveBeenCalled()
    expect(defaultUseList.removeTvShowFromTheList).toHaveBeenCalledWith({
      listId: "123",
      tvShow: expect.objectContaining({
        id: "dorama-1",
        title: "Pousando no Amor",
      }),
    })
  })

  it("should call markTvShowAsWatched on click on eye button if tv show was not watched", () => {
    const { getByTestId } = render(<ListsDetailsPage />)
    const trashIcon = getByTestId("eye-button")
    fireEvent.click(trashIcon)

    expect(defaultUseTvShow.markTvShowAsWatched).toHaveBeenCalled()
  })

  it("should call removeTvShowFromWatched on click on eye button if tv show was watched", () => {
    ;(useTvShow as jest.Mock).mockReturnValue({
      ...defaultUseTvShow,
      watchedTvShows: [{
        id: "dorama-1",
          title: "Pousando no Amor",
      }],
    })

    const { getByTestId } = render(<ListsDetailsPage />)
    const trashIcon = getByTestId("eye-button")
    fireEvent.click(trashIcon)

    expect(defaultUseTvShow.removeTvShowFromWatched).toHaveBeenCalled()
  })
})
