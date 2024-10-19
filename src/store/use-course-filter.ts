import { atom, useAtom } from 'jotai'

export const conuseCoursesFilterAtom = atom(false)

export const useCoursesFilterStore = () => {
  return useAtom(conuseCoursesFilterAtom)
}
