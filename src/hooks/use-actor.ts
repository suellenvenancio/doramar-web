import { useCallback } from "react"
import useSWR from "swr"

import { toast } from "@/components/toast"
import { actorService } from "@/services/actors.service "
import { Actor } from "@/types"

import { useUser } from "./use-user"

export function useActor() {
  const { user } = useUser()
  const userId = user?.id

  const findFavoriteActorsByUserId = useCallback(async (userId: string) => {
    try {
      return await actorService.findFavoriteActorsByUserId(userId)
    } catch (e) {
      console.error(`Erro ao buscar atores favoritos: ${e}`)
      return []
    }
  }, [])

  const { data, mutate } = useSWR<Actor[]>("actors", () =>
    findFavoriteActorsByUserId(userId ?? ""),
  )

  const markActorAsFavorite = useCallback(
    async (actorId: string) => {
      if (!userId) {
        toast("Erro ao marcar ator como favorito")
        return
      }

      try {
        const actor = await actorService.makeActorFavorite(userId, actorId)
        mutate()
        if (!actor) {
          toast("Ator removido dos favoritos!")
        } else {
          toast(`${actor.name} adicionado aos favoritos!`)
        }
      } catch (e) {
        console.error(`Erro salvar ator como favorito: ${e}`)
        toast("Erro ao atualizar favoritos.")
      }
    },
    [mutate, userId],
  )

  return {
    markActorAsFavorite,
    favoriteActors: data,
    findFavoriteActorsByUserId,
  }
}
