'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import 'react-quill/dist/quill.snow.css'

interface RichEditorProps {
  placeholder: string
  onChange: (value: string) => void
  value?: string
}

export const RichEditor = ({
  placeholder,
  onChange,
  value,
}: RichEditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  )

  return (
    <ReactQuill
      theme="snow"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}
