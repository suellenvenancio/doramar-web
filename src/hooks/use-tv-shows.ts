import { useCallback, useState } from "react"
import useSWR from "swr"

import { toast } from "@/components/toast"
import { tvShowService } from "@/services/tvShow.service"
import { type TvShow } from "@/types"

import { useUser } from "./use-user"

export function useTvShow() {
  const { user } = useUser()
  const userId = user?.id

  const limit = 20
  const [page, setPage] = useState(1)

  const { data: tvShows } = useSWR("tvShows", () =>
    tvShowService.getAllTvShows(),
  )

  const { data: watchedStatus } = useSWR(
    "watchedStatus",
    () => tvShowService.getWatchedStatus(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60 * 60 * 1000,
      suspense: true,
    },
  )

  const { data: watchedTvShows, mutate: mutateWatchedTvShows } = useSWR(
    userId ? ["watchedTvShows", userId] : null,
    () => tvShowService.getWatchedTvShowsByUserId(userId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60 * 60 * 1000,
      suspense: true,
    },
  )

  const { data: favoriteTvShow, mutate: mutateFavoriteTvShow } = useSWR<TvShow>(
    userId ? ["favoriteTvShow", userId] : null,
    () => tvShowService.findFavoriteTvShowByUserId(userId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60 * 60 * 1000,
      suspense: true,
    },
  )

  const { data: tvShowsByPage, isLoading: isLoadingTvShowsByPage } = useSWR(
    ["tvShowsByPage", page, limit],
    () => tvShowService.getTvShowsByPage(page, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60 * 60 * 1000,
      suspense: true,
    },
  )

  const markTvShowAsWatched = useCallback(
    async (tvShow: TvShow, watchedStatusId: string) => {
      if (!userId) return
      try {
        await tvShowService.markTvShowAsWatched(
          userId,
          tvShow.id,
          watchedStatusId,
        )

        mutateWatchedTvShows()
      } catch (e) {
        console.error("Erro ao marcar dorama como assistido!", e)
      }
    },
    [userId, mutateWatchedTvShows],
  )

  const fetchTvShowsByPage = (newPage: number) => {
    setPage(newPage)
  }

  const getWatchedTvShowsByUserId = async (userId: string) => {
    try {
      return await tvShowService.getWatchedTvShowsByUserId(userId)
    } catch (error) {
      console.error("Erro ao buscar doramas assistidos!", error)
      return null
    }
  }

  const findFavoriteTvShowByUserId = useCallback(async (userId: string) => {
    try {
      return await tvShowService.findFavoriteTvShowByUserId(userId)
    } catch (e) {
      console.error(`Erro ao buscar doramas favoritos: ${e}`)
      return null
    }
  }, [])

  const markTvShowAsFavorite = useCallback(
    async (tvShow: TvShow) => {
      if (!user) {
        toast("Erro ao marcar dorama como favorito!")
        return
      }

      try {
        const updatedFavTvShow = await tvShowService.addTVShowToFavorites(
          user.id,
          tvShow.id,
        )

        mutateFavoriteTvShow()

        const action = updatedFavTvShow ? "adicionado" : "removido"
        toast(`${tvShow.title} ${action} como favorito!`)
      } catch (error) {
        console.error("Erro ao marcar dorama como favorito", error)
        toast(`Erro ao atualizar favorito: ${tvShow.title}`)
      }
    },
    [user, mutateFavoriteTvShow],
  )

  const removeTvShowFromWatched = async (tvShow: TvShow) => {
    if (!userId) {
      toast("Erro ao remover dos assistidos!")
      return
    }
    try {
      await tvShowService.removeTvShowFromWatched(userId, tvShow.id)
      mutateWatchedTvShows()
    } catch (e) {
      console.error(`Erro ao remover ${tvShow.title} dos assistidos: ${e}`)
    }
  }
  return {
    tvShows: tvShows || [],
    watchedStatus: watchedStatus || [],
    watchedTvShows: watchedTvShows || [],
    markTvShowAsWatched,
    tvShowsByPage: tvShowsByPage,
    fetchTvShowsByPage,
    getWatchedTvShowsByUserId,
    isLoadingTvShowsByPage,
    findFavoriteTvShowByUserId,
    favoriteTvShow: favoriteTvShow,
    markTvShowAsFavorite,
    removeTvShowFromWatched,
  }
}
