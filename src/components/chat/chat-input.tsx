// 'use client'

// import { EmojiPicker } from '@/components/emoji-picker'
// import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { useCurrentUser } from '@/hooks/use-current-user'
// import { zodResolver } from '@hookform/resolvers/zod'
// import axios from 'axios'
// import { Plus } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import qs from 'query-string'
// import { useForm } from 'react-hook-form'
// import * as z from 'zod'

// import { Skeleton } from '../ui/skeleton'

// interface ChatInputProps {
//   apiUrl: string
//   query: Record<string, any>
//   name: string
//   type: 'conversation'
// }

// const formSchema = z.object({
//   content: z.string().min(1),
// })

// export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
//   const router = useRouter()

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       content: '',
//     },
//   })

//   const isLoading = form.formState.isSubmitting

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       const url = qs.stringifyUrl({
//         url: apiUrl,
//         query,
//       })

//       await axios.post(url, values)

//       form.reset()
//       router.refresh()
//     } catch (error) {
//       // console.log(error)
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)}>
//         <FormField
//           control={form.control}
//           name="content"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <div className="relative p-4 pb-6">
//                   {/* <button
//                     type="button"
//                     onClick={() =>
//                       onOpen('messageFile', {
//                         apiUrl,
//                         query: {
//                           ...query,
//                           content: form.getValues('content'),
//                           reset: form.reset,
//                         },
//                       })
//                     }
//                     className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
//                   >
//                     <Plus className="text-white dark:text-[#313338]" />
//                   </button> */}
//                   <Input
//                     disabled={isLoading}
//                     className="border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
//                     placeholder={`Message ${type === 'conversation' ? name : '#' + name}`}
//                     {...field}
//                   />
//                   <div className="absolute right-8 top-7">
//                     <EmojiPicker
//                       onChange={(emoji: string) =>
//                         field.onChange(`${field.value} ${emoji}`)
//                       }
//                     />
//                   </div>
//                 </div>
//               </FormControl>
//             </FormItem>
//           )}
//         />
//       </form>
//     </Form>
//   )
// }
