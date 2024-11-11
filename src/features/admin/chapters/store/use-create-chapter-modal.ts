import { atom, useAtom } from 'jotai'

export const createChapterModalAtom = atom(false)

export const useCreateChapterModal = () => {
  return useAtom(createChapterModalAtom)
}
