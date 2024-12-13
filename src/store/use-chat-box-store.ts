import { atom, useAtom } from 'jotai'

export const conuseChatBoxAtom = atom(false)

export const useChatBoxStore = () => {
  return useAtom(conuseChatBoxAtom)
}
