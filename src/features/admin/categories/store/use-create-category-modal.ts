import { atom, useAtom } from 'jotai'

export const createCategoryModalAtom = atom(false)

export const useCreateCategoryModal = () => {
  return useAtom(createCategoryModalAtom)
}
