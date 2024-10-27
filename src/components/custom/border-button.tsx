import { cn } from '@/lib/utils'

type Props = {
  label: string
  onClick: () => void
  disabled: boolean
  className?: string
}

export const BorderButton = ({
  label,
  onClick,
  disabled,
  className,
}: Props) => {
  const handleClick = (e: any) => {
    e.preventDefault()

    onClick?.()
  }

  return (
    <button
      className={cn(
        'group/button relative inline-block px-4 py-2 font-medium disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      <span
        className={cn(
          'absolute inset-0 h-full w-full translate-x-1 translate-y-1 transform bg-black transition duration-200 ease-out group-hover/button:-translate-x-0 group-hover/button:-translate-y-0',
          disabled && '-translate-x-0 -translate-y-0'
        )}
      ></span>
      <span
        className={cn(
          'absolute inset-0 h-full w-full border-2 border-black bg-white group-hover/button:bg-black',
          disabled && 'bg-black'
        )}
      ></span>
      <span
        className={cn(
          'relative line-clamp-1 text-black group-hover/button:text-white',
          disabled && 'text-white'
        )}
      >
        {label}
      </span>
    </button>
  )
}
