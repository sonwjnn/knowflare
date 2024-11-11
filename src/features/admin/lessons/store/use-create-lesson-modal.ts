import { atom, useAtom } from 'jotai'

export const createLessonModalAtom = atom(false)

export const useCreateLessonModal = () => {
  return useAtom(createLessonModalAtom)
}
