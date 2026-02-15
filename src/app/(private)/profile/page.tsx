"use client"
import Profile from "@/components/profile"
import { useActor } from "@/hooks/use-actor"
import { useList } from "@/hooks/use-list"
import { useRating } from "@/hooks/use-rating"
import { useTvShow } from "@/hooks/use-tv-shows"
import { useUser } from "@/hooks/use-user"

export default function MyProfilePage() {
  const { user, uploadProfilePicture } = useUser()
  const { watchedTvShows, favoriteTvShow } = useTvShow()
  const { ratings, createRating } = useRating()
  const { lists } = useList()
  const { favoriteActors } = useActor()

  return (
    <Profile
      user={user!}
      watchedTvShows={watchedTvShows}
      ratings={ratings}
      lists={lists ?? []}
      favoriteTvShow={favoriteTvShow}
      favoriteActors={favoriteActors ?? []}
      createRating={createRating}
      uploadProfilePicture={uploadProfilePicture}
    />
  )
}
