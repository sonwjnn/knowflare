import { atom, useAtom } from 'jotai'

export const changePasswordModalAtom = atom(false)

export const useChangePasswordModal = () => {
  return useAtom(changePasswordModalAtom)
}
