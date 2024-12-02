import { atom, useAtom } from 'jotai'

export const createCouponModalAtom = atom(false)

export const useCreateCouponModal = () => {
  return useAtom(createCouponModalAtom)
}
