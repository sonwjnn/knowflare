import { useSocket } from '@/components/providers/socket-provider'
import { MessageWithUser } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'

interface ChatQueryProps {
  queryKey: string
  type: 'conversation'
  tableId: string
  conversationId: string
}

type DirectMessageType = {
  items: MessageWithUser[]
  nextCursor: string | null
}

export const useChatQuery = ({
  queryKey,
  type,
  tableId,
  conversationId,
}: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({
    pageParam,
  }: {
    pageParam: string | undefined
  }) => {
    let res

    if (type === 'conversation') {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/conversations`
      )
      url.searchParams.append('conversationId', conversationId)
      if (pageParam) {
        url.searchParams.append('cursor', pageParam)
      }

      res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!res?.ok) return null

    const data = (await res.json()) as DirectMessageType

    return data
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: undefined,
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: lastPage => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}
