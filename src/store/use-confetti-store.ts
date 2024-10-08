import { atom, useAtom } from 'jotai'

export const conuseConfettiAtom = atom(false)

export const useConfettiStore = () => {
  return useAtom(conuseConfettiAtom)
}
