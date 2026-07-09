import type { HTMLAttributes, ReactNode } from 'react'
import { classNames } from '../../utils/classNames'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={classNames('ui-card', className)} {...props}>
      {children}
    </div>
  )
}
