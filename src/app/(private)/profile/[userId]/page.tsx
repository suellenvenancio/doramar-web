"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import Profile from "@/components/profile"
import { useActor } from "@/hooks/use-actor"
import { useList } from "@/hooks/use-list"
import { useRating } from "@/hooks/use-rating"
import { useTvShow } from "@/hooks/use-tv-shows"
import { useUser } from "@/hooks/use-user"
import {
  Actor,
  type List,
  type Rating,
  TvShow,
  type User,
  type WatchedTvShow,
} from "@/types"

export default function ProfilePage() {
  const [user, setUser] = useState<User | undefined>()
  const [watchedTvShows, setWatchedTvShows] = useState<WatchedTvShow[]>([])
  const [lists, setLists] = useState<List[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [favoriteTvShow, setFavoriteTvShow] = useState<TvShow | undefined>()
  const [favoriteActors, setFavoriteActors] = useState<Actor[]>([])

  const { findUserById } = useUser()
  const { getWatchedTvShowsByUserId, findFavoriteTvShowByUserId } = useTvShow()
  const { getRatingsByUserId, createRating } = useRating()
  const { getListsByUserId } = useList()
  const { findFavoriteActorsByUserId } = useActor()
  const params = useParams()
  const userId = params.userId as string

  useEffect(() => {
    if (!userId) return

    const fetchUserData = async (userId: string) => {
      try {
        const [
          user,
          watchedTvShowsFetched,
          fetchedLists,
          fetchedRatings,
          favTvShow,
          favActors,
        ] = await Promise.all([
          findUserById(userId),
          getWatchedTvShowsByUserId(userId),
          getListsByUserId(userId),
          getRatingsByUserId(userId),
          findFavoriteTvShowByUserId(userId),
          findFavoriteActorsByUserId(userId),
        ])

        setUser(user)
        setWatchedTvShows(watchedTvShowsFetched ?? [])
        setLists(fetchedLists ?? [])
        setRatings(fetchedRatings ?? [])
        setFavoriteTvShow(favTvShow || undefined)
        setFavoriteActors(favActors)
      } catch (error) {
        console.error(`Erro aos buscar dados do usuário: ${error}`)
      }
    }

    fetchUserData(userId)
  }, [userId])

  return (
    <Profile
      user={user!}
      watchedTvShows={watchedTvShows}
      ratings={ratings}
      lists={lists ?? []}
      favoriteTvShow={favoriteTvShow}
      favoriteActors={favoriteActors ?? []}
      createRating={createRating}
    />
  )
}
