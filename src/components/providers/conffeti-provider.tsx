'use client'

import { useConfettiStore } from '@/store/use-confetti-store'
import ReactConfetti from 'react-confetti'

export const ConfettiProvider = () => {
  const [open] = useConfettiStore()
  if (!open) return null
  return (
    <ReactConfetti
      className="pointer-event-none z-[100]"
      numberOfPieces={500}
      recycle={false}
    />
  )
}
