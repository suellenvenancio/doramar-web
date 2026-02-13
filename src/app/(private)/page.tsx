"use client"
import { useCallback, useMemo, useState } from "react"

import { CircleIcon } from "@/components/icons/circle"
import { Layout } from "@/components/layout"
import { CastModal } from "@/components/modal/castModal"
import { CreateListModal } from "@/components/modal/createListModal"
import { Pagination } from "@/components/pagination"
import { TVShowItem } from "@/components/tvShowItem"
import { useList } from "@/hooks/use-list"
import { useTvShow } from "@/hooks/use-tv-shows"
import { type TvShow } from "@/types"

export default function HomePage() {
  const { tvShows, tvShowsByPage, fetchTvShowsByPage, isLoadingTvShowsByPage } =
    useTvShow()

  const [search, setSearch] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const tvShowsToRender = useMemo(() => {
    let results = [...(tvShowsByPage?.results ?? [])]

    const searchQuery = search.trim().toLowerCase()
    if (searchQuery) {
      results = tvShows.filter((show) =>
        show.title.toLowerCase().includes(searchQuery),
      )
    }

    if (selectedGenres.length > 0) {
      results = results.filter((show) =>
        show.genres?.some((genre) => selectedGenres.includes(genre.id)),
      )
    }

    return results
  }, [tvShowsByPage?.results, tvShows, search, selectedGenres])

  const currentPage = tvShowsByPage?.page ?? 1
  const totalPages = tvShowsByPage?.totalPages ?? 0

  const onChange = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const onSelectGenre = useCallback((genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    )
  }, [])

  const onPageChange = (newPage: number) => {
    fetchTvShowsByPage(newPage)
  }

  return (
    <Layout
      page="Home"
      headerProps={{
        search: search,
        setSearch: onChange,
        selectedGenres: selectedGenres,
        onSelectGenre: onSelectGenre,
        page: "Home",
      }}
      currentPage={currentPage}
    >
      {isLoadingTvShowsByPage ? (
        <LoadingTvShows />
      ) : (
        <TVShowsList
          tvShowsToRender={tvShowsToRender}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </Layout>
  )
}

function LoadingTvShows() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-24">
      <CircleIcon className="h-12 w-12 text-pink-600" />
      <p className="mt-4 text-pink-600 font-medium">Carregando doramas...</p>
    </div>
  )
}

function TVShowsList({
  tvShowsToRender,
  currentPage,
  totalPages,
  onPageChange,
}: {
  tvShowsToRender: TvShow[]
  currentPage: number
  totalPages: number
  onPageChange: (newPage: number) => void
}) {
  const [showCastModal, setShowCastModal] = useState(false)
  const [selectedTvShow, setSelectedTvShow] = useState<TvShow>()
  const [showCreateListModal, setShowCreateListModal] = useState(false)

  const { createList } = useList()

  return (
    <div className="w-full mt-6 flex flex-col md:flex-row md:flex-wrap md:items-start md:justify-evenly p-6">
      {tvShowsToRender.length > 0 ? (
        tvShowsToRender.map((show) => {
          return (
            <TVShowItem
              key={show.id}
              show={show}
              setShowCreateListModal={setShowCreateListModal}
              setShowCastModal={setShowCastModal}
              setSelectedTvShow={setSelectedTvShow}
              showCastModal={showCastModal}
            />
          )
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center m-2">
          <p className="text-lg font-semibold text-[#6E5A6B]">
            Não existe nenhum dorama disponível!
          </p>
        </div>
      )}
      {tvShowsToRender.length > 0 && tvShowsToRender.length === 20 && (
        <Pagination
          currentPage={currentPage ?? 1}
          totalPages={totalPages ?? 0}
          onPageChange={onPageChange}
        />
      )}

      {showCastModal && (
        <CastModal
          onClose={() => setShowCastModal(false)}
          actors={selectedTvShow?.actors ?? []}
        />
      )}

      <CreateListModal
        isOpen={showCreateListModal}
        onClose={() => setShowCreateListModal(false)}
        onCreate={createList}
      />
    </div>
  )
}
