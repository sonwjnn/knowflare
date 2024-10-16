import { atom, useAtom } from 'jotai'

export const chaptersSheetAtom = atom(false)

export const useChaptersSheet = () => {
  return useAtom(chaptersSheetAtom)
}
