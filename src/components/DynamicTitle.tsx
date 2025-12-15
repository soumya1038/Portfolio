'use client'

import { useEffect } from 'react'

interface DynamicTitleProps {
  name: string
}

export default function DynamicTitle({ name }: DynamicTitleProps) {
  useEffect(() => {
    document.title = `${name} - Portfolio`
  }, [name])

  return null
}