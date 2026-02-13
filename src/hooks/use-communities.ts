import useSWR from "swr"

import { toast } from "@/components/toast"
import { communitiesService } from "@/services/communities.service"
import type { Community, ReactionTargetType, ReactionType } from "@/types"

import { useUser } from "./use-user"

export function useCommunities() {
  const { user } = useUser()
  const userId = user?.id

  const { data, mutate, isLoading } = useSWR<Community[]>(
    "communities",
    () => communitiesService.getAllCommunities(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60 * 60 * 1000,
      suspense: true,
    },
  )

  const createCommunity = async ({
    description,
    name,
    visibility,
  }: {
    name: string
    visibility: string
    description?: string
  }) => {
    if (!userId) {
      toast("Erro ao criar comunidade!")
      return
    }
    try {
      await communitiesService.createCommunity({
        name,
        userId,
        visibility,
        description,
      })

      mutate()
    } catch (error) {
      toast("Erro ao criar a comunidade!")
      console.error(`Erro ao criar comunidade: ${error}`)
    }
  }

  const createPost = async ({
    communityId,
    content,
  }: {
    communityId: string
    content: string
  }) => {
    if (!userId) {
      toast("Erro ao criar a post!")
      return
    }

    try {
      return communitiesService.createPost({ communityId, content, userId })
    } catch (error) {
      toast("Erro ao criar a post!")
      console.error(`Erro ao criar post: ${error}`)
    }
  }

  const getCommunityPosts = async (communityId: string) => {
    if (!userId) {
      toast("Erro ao buscar posts!")
      return
    }

    try {
      return await communitiesService.getCommunityPosts(communityId)
    } catch (error) {
      console.error(`Erro ao buscar posts: ${error}`)
    }
  }

  const getPostsComments = async (postId: string) => {
    if (!userId) {
      toast("Erro ao buscar comentários!")
      return
    }

    try {
      return await communitiesService.getPostComments(postId)
    } catch (error) {
      console.error(`Erro ao buscar comentários: ${error}`)
    }
  }

  const createComment = async (
    postId: string,
    communityId: string,
    content: string,
  ) => {
    try {
      if (!userId) {
        toast("Erro ao criar comentário!")
        return
      }

      return await communitiesService.createComment({
        postId,
        communityId,
        content,
        userId,
      })
    } catch (error) {
      toast("Erro ao criar comentário!")

      console.error("Erro ao criar comentário!", error)
      return null
    }
  }

  const createReaction = async ({
    postId,
    communityId,
    targetType,
    type,
  }: {
    postId: string
    communityId: string
    targetType: ReactionTargetType
    type: ReactionType
  }) => {
    try {
      if (!userId) {
        toast("Erro ao criar reação!")
        return
      }

      return await communitiesService.createReaction({
        postId,
        communityId,
        userId,
        targetType,
        type,
      })
    } catch (error) {
      toast("Erro ao criar reação!")

      console.error("Erro ao criar reações!", error)
      return null
    }
  }

  const getReactionsByPostId = async (postId: string) => {
    try {
      if (!userId) {
        toast("Erro ao buscar reações!")
        return
      }

      return await communitiesService.getReactsByPostId(postId)
    } catch (error) {
      console.error("Erro ao buscar reações!", error)
    }
  }

  const addMemberOnTheCommunity = async (
    communityId: string,
    userId: string,
  ) => {
    try {
      await communitiesService.addMemberOnTheCommunity({
        communityId,
        userId,
      })
      mutate()
    } catch (error) {
      console.error("Erro ao adicionar participante a comunidade", error)
      toast("Erro ao adicionar participante")
    }
  }

  const uploadCommunityProfilePicture = async ({
    communityId,
    formData,
  }: {
    communityId: string
    formData: FormData
  }) => {
    try {
      const communityWithNewAvatar =
        await communitiesService.uploadCommunityProfilePicture({
          communityId,
          formData,
        })

      mutate()
      return communityWithNewAvatar
    } catch (error) {
      toast("Erro ao fazer upload da imagem do perfil da comunidade")

      console.error(
        "Erro ao fazer upload da imagem do perfil da comunidade",
        error,
      )
    }
  }

  const uploadCommunityCoverPicture = async ({
    communityId,
    formData,
  }: {
    communityId: string
    formData: FormData
  }) => {
    try {
      const communityWithNewCoverPicture =
        await communitiesService.uploadCommunityCoverPicture({
          communityId,
          formData,
        })

      mutate()
      return communityWithNewCoverPicture
    } catch (error) {
      console.error(
        "Erro ao fazer upload da imagem de capa da comunidade",
        error,
      )
      toast("Erro ao fazer upload da imagem de capa da comunidade")
    }
  }

  const deleteCommunity = async (communityId: string) => {
    try {
      await communitiesService.deleteCommunity(communityId)
      mutate((prev) =>
        prev?.filter((community) => community.id !== communityId),
      )
      toast("Comunidade deletada com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar comunidade", error)
      toast("Erro ao deletar comunidade")
    }
  }

  const deletePost = async (postId: string, communityId: string) => {
    try {
      await communitiesService.deletePost(postId, communityId)
      toast("Post deletado com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar post", error)
      toast("Erro ao deletar post")
    }
  }

  const deleteComment = async (params: {
    commentId: string
    communityId: string
    postId: string
  }) => {
    try {
      await communitiesService.deleteComment(params)
      toast("Comentário deletado com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar comentário", error)
      toast("Erro ao deletar comentário")
    }
  }

  return {
    communities: data || [],
    isLoading,
    createCommunity,
    createPost,
    getPostsComments,
    getCommunityPosts,
    createComment,
    createReaction,
    getReactionsByPostId,
    addMemberOnTheCommunity,
    uploadCommunityProfilePicture,
    uploadCommunityCoverPicture,
    deleteCommunity,
    deletePost,
    deleteComment,
  }
}
