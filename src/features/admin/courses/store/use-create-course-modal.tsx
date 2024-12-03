import { atom, useAtom } from 'jotai'

export const createCourseModalAtom = atom(false)

export const useCreateCourseModal = () => {
  return useAtom(createCourseModalAtom)
}
