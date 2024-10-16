import { atom, useAtom } from 'jotai'

export const commentsSheetAtom = atom(false)

export const useCommentsSheet = () => {
  return useAtom(commentsSheetAtom)
}
