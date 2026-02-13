import { useCallback } from "react"
import useSWR from "swr"

import { toast } from "@/components/toast"
import { ratingService } from "@/services/ratings.service"
import type { RatingWithTvShow } from "@/types"

import { useUser } from "./use-user"

export function useRating() {
  const { user } = useUser()

  const userId = user?.id

  const { data, mutate } = useSWR<RatingWithTvShow[]>(
    userId ? ["ratings", userId] : null,
    () => ratingService.getRatingsByUserId(userId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60 * 60 * 1000,
      suspense: true,
    },
  )

  const createRating = useCallback(
    async (tvShowId: string, scaleId: number) => {
      try {
        if (!userId) {
          toast("Erro ao avaliar dorama!")
          return
        }
        await ratingService.createRating(userId, tvShowId, scaleId)
        mutate()
      } catch (error) {
        toast("Erro ao avaliar dorama!")

        console.error(`Erro ao ao avaliação: ${error}`)
      }
    },
    [mutate, userId],
  )

  const getRatingsByUserId = async (userId: string) => {
    try {
      return await ratingService.getRatingsByUserId(userId)
    } catch (error) {
      console.error(`Erro ao buscar avaliações: ${error}`)
      return null
    }
  }

  return {
    createRating,
    ratings: data || [],
    getRatingsByUserId,
  }
}
