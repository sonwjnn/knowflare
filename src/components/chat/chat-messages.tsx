// 'use client'

// import { useChatQuery } from '@/hooks/use-chat-query'
// import { useChatScroll } from '@/hooks/use-chat-scroll'
// import { useChatSocket } from '@/hooks/use-chat-socket'
// import { MessageWithUser } from '@/types'
// import { format } from 'date-fns'
// import { Loader2, ServerCrash } from 'lucide-react'
// import { ElementRef, Fragment, useRef } from 'react'

// import { ChatItem } from './chat-item'

// const DATE_FORMAT = 'd MMM yyyy, HH:mm'

// interface ChatMessagesProps {
//   name: string
//   chatId: string
//   socketUrl: string
//   socketQuery: Record<string, string>
//   channelId?: string
//   conversationId?: string
//   type: 'conversation'
// }

// export const ChatMessages = ({
//   name,
//   chatId,
//   socketUrl,
//   socketQuery,
//   channelId,
//   conversationId,
//   type,
// }: ChatMessagesProps) => {
//   const queryKey = `chat:${chatId}`
//   const addKey = `chat:${chatId}:messages`
//   const updateKey = `chat:${chatId}:messages:update`

//   const chatRef = useRef<ElementRef<'div'>>(null)
//   const bottomRef = useRef<ElementRef<'div'>>(null)

//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
//     useChatQuery({
//       queryKey,
//       type,
//       conversationId: conversationId || '',
//     })
//   useChatSocket({ queryKey, addKey, updateKey })
//   useChatScroll({
//     chatRef,
//     bottomRef,
//     loadMore: fetchNextPage,
//     shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
//     count: data?.pages?.[0]?.items?.length ?? 0,
//   })

//   // if (status === 'pending') {
//   //   return <ChatMessagesSkeleton />
//   // }

//   if (status === 'error') {
//     return (
//       <div className="flex flex-1 flex-col items-center justify-center">
//         <ServerCrash className="my-4 size-7 text-zinc-500" />
//         <p className="text-xs text-zinc-500 dark:text-zinc-400">
//           Something went wrong!
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
//       {!hasNextPage && <div className="flex-1" />}
//       {/* {!hasNextPage && <ChatWelcome type={type} name={name} />} */}
//       {hasNextPage && (
//         <div className="flex justify-center">
//           {isFetchingNextPage ? (
//             <Loader2 className="my-4 size-6 animate-spin text-zinc-500" />
//           ) : (
//             <button
//               onClick={() => fetchNextPage()}
//               className="my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
//             >
//               Load previous messages
//             </button>
//           )}
//         </div>
//       )}
//       <div className="mt-auto flex flex-col-reverse">
//         {data?.pages?.map((group, i) => (
//           <Fragment key={i}>
//             {group?.items.map((message: MessageWithUser) => (
//               <ChatItem
//                 key={message.id}
//                 id={message.id}
//                 user={message.user}
//                 content={message.content}
//                 fileUrl={message.fileUrl}
//                 deleted={message.deleted}
//                 timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
//                 isUpdated={message.updatedAt !== message.createdAt}
//                 socketUrl={socketUrl}
//                 socketQuery={socketQuery}
//               />
//             ))}
//           </Fragment>
//         ))}
//       </div>
//       <div ref={bottomRef} />
//     </div>
//   )
// }
