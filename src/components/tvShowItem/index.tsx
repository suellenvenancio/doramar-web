import { useCallback, useState } from "react"

import { useList } from "@/hooks/use-list"
import { useRating } from "@/hooks/use-rating"
import { useTvShow } from "@/hooks/use-tv-shows"

import {
  ButtonTypeEnum,
  type List,
  type TvShow,
  WatchedTvShow,
} from "../../types"
import { Avatar } from "../avatar"
import { IconButton } from "../button/iconButton"
import { StarRating } from "../button/starRating"
import { EyeIcon } from "../icons/eye"
import { HeartIcon } from "../icons/heart"
import { PlusIcon } from "../icons/plus"
import { PopUpMenu } from "../popup"

interface DramaItemProps {
  show: TvShow
  setShowCastModal: (showCastModal: boolean) => void
  setSelectedTvShow: (tvShow: TvShow) => void
  showCastModal: boolean
  setShowCreateListModal: (showCreateListModal: boolean) => void
}

const statusColorClassMap: Record<string, string> = {
  green: "text-green-500",
  yellow: "text-yellow-500",
  red: "text-red-500",
  gray: "text-gray-400",
}

const getStatusColor = (watchedTvShows: WatchedTvShow[], tvShowId: string) => {
  const status = watchedTvShows.find((tv) => tv.id === tvShowId)?.watchStatus
  switch (status) {
    case "Finalizado":
      return "green"
    case "Assistindo":
      return "yellow"
    case "Abandonei":
      return "red"
    default:
      return "gray"
  }
}

export function TVShowItem({
  show,
  setShowCastModal,
  setSelectedTvShow,
  showCastModal,
  setShowCreateListModal,
}: DramaItemProps) {
  const [activePopup, setActivePopup] = useState<{
    id: string | null
    type: ButtonTypeEnum | null
  }>({ id: null, type: null })

  const { lists, addTvShowToList } = useList()
  const {
    markTvShowAsWatched,
    watchedStatus,
    favoriteTvShow,
    watchedTvShows,
    markTvShowAsFavorite,
  } = useTvShow()
  const { ratings, createRating } = useRating()

  const handleWatchStatusChange = async ({
    tvShow,
    watchedStatusId,
  }: {
    tvShow: TvShow
    watchedStatusId: string
  }) => {
    await markTvShowAsWatched(tvShow, watchedStatusId)
  }

  const handleAddTvShowToList = async ({
    list,
    tvShow,
  }: {
    list: List
    tvShow: TvShow
  }) => {
    await addTvShowToList(list, tvShow)
  }

  const onWatchStatusChange = async (data: {
    tvShow: TvShow
    watchedStatusId: string
  }) => {
    await handleWatchStatusChange(data)
    setActivePopup({ id: null, type: null })
  }
  const onAddTvShowInTheList = async (data: { list: List; tvShow: TvShow }) => {
    handleAddTvShowToList(data)
    setActivePopup({ id: null, type: null })
  }

  const checkTheFavoriteTvShow = useCallback(
    (tvShowId: string) => {
      return favoriteTvShow?.id === tvShowId
    },
    [favoriteTvShow],
  )

  const watchedStatusColor = getStatusColor(watchedTvShows, show.id)
  const isFavorite = checkTheFavoriteTvShow(show.id)
  const initialRating =
    ratings.find((r) => r.tvShow.id === show.id)?.scaleId ?? 0

  const handleCastModalButton = (tvShow: TvShow) => {
    setSelectedTvShow(tvShow)
    setShowCastModal(!showCastModal)
  }

  return (
    <div
      className="flex flex-col md:flex-row items-center md:items-start
      mb-8 bg-[#F7EFF2]/85 rounded-xl shadow-lg overflow-visible p-6 w-full max-w-xl mx-auto gap-6  "
      key={show?.id}
    >
      <div className="w-full md:w-40 flex flex-col items-center flex-shrink-0 gap-4">
        <div className="h-auto w-40 md:w-full relative shadow-md rounded-md overflow-hidden">
          <Avatar
            imageUrl={show.poster}
            title={show.title}
            className="h-full w-full object-cover"
          />
        </div>

        <StarRating
          initialRating={initialRating}
          size={24}
          colorEmpty="#F2E9EB"
          tvShowId={show.id}
          onRate={createRating}
          isMyProfilePage={true}
        />

        <div className="flex flex-row justify-center md:justify-between gap-12 md:gap-4 items-center md:w-full text-gray-400">
          <div className="relative inline-block">
            <IconButton
              icon={<EyeIcon />}
              onClick={() =>
                setActivePopup((prev) =>
                  prev.type === ButtonTypeEnum.EYE
                    ? { id: null, type: null }
                    : { id: show.id, type: ButtonTypeEnum.EYE },
                )
              }
              className={`transition-colors hover:scale-110 mt-1.5 ${
                statusColorClassMap[watchedStatusColor] ?? "text-gray-400"
              }`}
            />

            {activePopup.id === show.id &&
              activePopup.type === ButtonTypeEnum.EYE && (
                <PopUpMenu
                  type="Status"
                  title="Status"
                  items={watchedStatus}
                  onClick={onWatchStatusChange}
                  tvShow={show}
                />
              )}
          </div>

          <IconButton
            icon={
              <HeartIcon
                className={isFavorite ? "fill-red-500 text-red-500" : ""}
              />
            }
            onClick={async () => {
              await markTvShowAsFavorite(show)
            }}
            className={`hover:text-red-500 transition-colors hover:scale-110`}
          />

          <div className="relative inline-block">
            <IconButton
              icon={<PlusIcon />}
              onClick={() =>
                setActivePopup((prev) =>
                  prev.type === ButtonTypeEnum.PLUS
                    ? { id: null, type: null }
                    : { id: show.id, type: ButtonTypeEnum.PLUS },
                )
              }
              className="hover:text-blue-500 transition-colors hover:scale-110"
            />
            {activePopup.id === show.id &&
              activePopup.type === ButtonTypeEnum.PLUS && (
                <PopUpMenu
                  type="Listas"
                  title="Listas"
                  items={
                    lists.length > 0
                      ? lists.map((list) => ({
                          id: list.id,
                          label: list.name,
                        }))
                      : [{ id: "0", label: "Criar Lista" }]
                  }
                  tvShow={show}
                  onClick={
                    lists.length > 0
                      ? onAddTvShowInTheList
                      : setShowCreateListModal
                  }
                />
              )}
          </div>
        </div>

        <button
          onClick={() => handleCastModalButton(show)}
          className="rounded-full  px-5 py-2 text-sm font-bold text-pink-800
            transition bg-pink-200 hover:bg-pink-300 active:scale-95 w-full"
        >
          Mostrar elenco
        </button>
      </div>

      <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
        <h2 className="text-xl font-bold text-slate-900 mb-2">{show?.title}</h2>
        <p className="text-slate-700 leading-relaxed text-sm md:text-base">
          {show?.synopsis}
        </p>
      </div>
    </div>
  )
}
