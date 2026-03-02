import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
   <img
  alt="Liv Well"
  width={220}
  height={50}
  loading={loading}
  fetchPriority={priority}
  decoding="async"
  className={clsx('max-w-[13.75rem] w-full h-[50px] object-contain', className)}
  src="/logo.png"
/>
  )
}
