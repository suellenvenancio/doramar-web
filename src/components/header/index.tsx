import Cookies from "js-cookie"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

import doramar from "@/assets/doramar.png"
import { auth } from "@/firebase.config"
import { useGenres } from "@/hooks/use-genres"
import { AuthService } from "@/services/auth.service"
import { ButtonTypeEnum, type Page } from "@/types"

import { IconButton } from "../button/iconButton"
import { ExitIcon } from "../icons/exit"
import { FilterIcon } from "../icons/filter"
import { PopUpMenu } from "../popup"
import { SearchInput } from "../searchInput"

interface HeaderProps {
  search?: string
  setSearch?: (value: string) => void
  selectedGenres?: string[]
  onSelectGenre?: (genreId: string) => void
  page?: Page
}
export function Header({
  search,
  setSearch,
  selectedGenres,
  onSelectGenre,
  page,
}: HeaderProps) {
  const [activePopup, setActivePopup] = useState<ButtonTypeEnum | null>(null)

  const { genres } = useGenres()
  const router = useRouter()

  const onActivePopUp = () => {
    setActivePopup((prev) =>
      prev === ButtonTypeEnum.FILTER ? null : ButtonTypeEnum.FILTER,
    )
  }

  const handleSignOut = async () => {
    const authService = new AuthService(auth)
    authService.signOut().then(() => {
      Cookies.remove("appToken")
      router.push("/login")
    })
  }

  return (
    <header className="sticky top-0 z-50 flex bg-[#FEB5D0] p-2 w-full justify-between">
      <Image className="h-12 w-24 md:w-36" src={doramar} alt="logo" />

      {page === "Home" && (
        <div className="flex items-center w-full col-span-2 md:ml-12">
          <SearchInput
            value={search ?? ""}
            onChange={setSearch ?? (() => {})}
            className=" w-[70%] md:w-[70%] m-0"
          />
          <div className="relative">
            <IconButton
              data-testid="filter-button"
              icon={<FilterIcon />}
              onClick={onActivePopUp}
              className="text-[#e91e63] ml-4"
            />
            {activePopup === ButtonTypeEnum.FILTER && (
              <PopUpMenu
                hasCheckBoxes={true}
                type="Gêneros"
                title="Gêneros"
                items={
                  genres?.map((genre) => {
                    return { id: genre.id, label: genre.name }
                  }) ?? []
                }
                onClick={onSelectGenre ?? (() => {})}
                className="top-full right-0 mt-2"
                selectedGenres={selectedGenres}
              />
            )}
          </div>
        </div>
      )}
      <IconButton
        data-testid="exit-button"
        icon={<ExitIcon className="text-[#e91e63]" />}
        onClick={handleSignOut}
        className="mr-4"
      />
    </header>
  )
}
