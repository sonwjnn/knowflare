import { atom, useAtom } from 'jotai'

export const cartSheetAtom = atom(false)

export const useCartSheet = () => {
  return useAtom(cartSheetAtom)
}
