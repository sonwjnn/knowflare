import { atom, useAtom } from 'jotai'

export const conuseIsCollapsedAtom = atom(false)

export const useIsCollapsedStore = () => {
  return useAtom(conuseIsCollapsedAtom)
}
