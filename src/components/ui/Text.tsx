import type { HTMLAttributes, ReactNode } from 'react'
import { classNames } from '../../utils/classNames'

interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export function Eyebrow({ children, className, ...props }: EyebrowProps) {
  return (
    <p className={classNames('ui-eyebrow', className)} {...props}>
      {children}
    </p>
  )
}
