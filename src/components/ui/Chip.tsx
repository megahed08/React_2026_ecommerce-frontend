import type { HTMLAttributes, ReactNode } from 'react'
import { classNames } from '../../utils/classNames'

type ChipTone = 'neutral' | 'accent'

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  tone?: ChipTone
}

export function Chip({ children, className, tone = 'neutral', ...props }: ChipProps) {
  return (
    <span className={classNames('ui-chip', `ui-chip--${tone}`, className)} {...props}>
      {children}
    </span>
  )
}
