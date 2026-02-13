import useSWR from "swr"

import { genreService } from "@/services/genres.service"
import type { Genre } from "@/types"

export function useGenres() {
  const { data } = useSWR<Genre[]>("genres", () => genreService.fetchGenre(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60 * 60 * 1000,
    suspense: true,
  })

  return {
    genres: data || [],
  }
}
