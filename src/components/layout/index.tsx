import React, { useEffect, useRef } from "react"

import { ButtonTypeEnum, type Genre, type Page } from "@/types"
import { mergeCn } from "@/utils/cn"

import { Header } from "../header"
import { MobileFooterMenu } from "../mobileFooterMenu"
import { SideBar } from "../sidebar"

interface LayoutProps {
  children: React.ReactNode
  className?: string
  page: Page
  headerProps?: {
    search: string
    setSearch: (value: string) => void
    activePopup: ButtonTypeEnum | null
    genres: Genre[]
    selectedGenres: string[]
    onSelectGenre: (genreId: string) => void
    setActivePopUp: () => void
    page: Page
  }
  currentPage?: number
}

export function Layout({
  children,
  className,
  headerProps,
  page,
  currentPage,
}: LayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollRef.current) return

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    })
  }, [currentPage])

  return (
    <div
      className={mergeCn(
        `w-full flex flex-col justify-between items-center relative`,
        className,
      )}
    >
      <Header {...{ page, ...(headerProps && headerProps) }} />
      <div className="flex md:flex-row w-full md:items-start items-center mt-4">
        <SideBar />
        <main className="mb-12 w-full overflow-y-auto h-screen" ref={scrollRef}>
          {children}
        </main>
      </div>
      <MobileFooterMenu />
    </div>
  )
}
