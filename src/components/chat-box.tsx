'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useChatBoxStore } from '@/store/use-chat-box-store'
import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useClickAway } from 'react-use'

export const ChatBox = () => {
  const [open, setOpen] = useChatBoxStore()
  const chatBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useClickAway(chatBoxRef, () => {
    setOpen(false)
  })

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-4 right-4 z-10 rounded-full px-2 py-3 transition-all duration-300 ease-in-out ${
          open ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
      <div
        className={cn(
          'fixed bottom-20 right-4 z-10 h-[600px] w-96 rounded-lg bg-[#1a1d24] shadow-lg transition-all duration-300 ease-in-out',
          open
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        )}
        ref={chatBoxRef}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center gap-3 rounded-t-lg border-b border-gray-800 bg-[#1a1d24] p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-medium text-white">Alex cairo</h1>
            </div>
          </header>

          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-lg bg-[#056162] px-3 py-2 text-white">
                  <p>Thats my duty, mention not</p>
                  <span className="block text-right text-xs text-gray-400">
                    02:32am
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] rounded-lg bg-[#232d38] px-3 py-2 text-white">
                  <p>
                    sorry to bother again but can i ask you one more favour?
                  </p>
                  <span className="block text-xs text-gray-400">01:25am</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-lg bg-[#056162] px-3 py-2 text-white">
                  <p>yeah sure, go ahead?</p>
                  <span className="block text-right text-xs text-gray-400">
                    02:32am
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] rounded-lg bg-[#232d38] px-3 py-2 text-white">
                  <p>
                    I really had a scary feeling about this, can please advice
                    me tricks to overcome my anxiety?
                  </p>
                  <span className="block text-xs text-gray-400">01:25am</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div
                    key={i}
                    className="w-16 rounded-lg bg-[#056162] px-3 py-2 text-center text-white"
                  >
                    <span className="text-xs">1:53</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>

          <div className="rounded-b-lg border-t border-gray-800 bg-[#1a1d24] p-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                className="border-0 bg-[#2a2f35] text-white placeholder:text-gray-400 focus-visible:ring-0"
              />

              <Button variant="ghost" size="icon" className="text-gray-400">
                <Send className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
