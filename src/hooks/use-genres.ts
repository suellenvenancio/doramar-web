import useSWR from "swr"

import { genreService } from "@/services/genres.service"
import type { Genre } from "@/types"

export function useGenres() {
  const { data } = useSWR<Genre[]>("genres", () => genreService.fetchGenre())

  return {
    genres: data || [],
  }
}
