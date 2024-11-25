import { HeartIcon } from '@/public/icons'
import { useState } from 'react'

type Props = {
  id: string

  onChange: () => void
}

export const CheckboxHeart = () => {
  const [checked, setChecked] = useState(false)

  const onClick = (e: any) => {
    e.preventDefault()
    setChecked(!checked)
  }

  return <div></div>
}
