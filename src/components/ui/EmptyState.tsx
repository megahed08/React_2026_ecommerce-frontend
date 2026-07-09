import type { HTMLAttributes } from 'react'
import { classNames } from '../../utils/classNames'
import { Card } from './Card'

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  description: string
  title: string
}

export function EmptyState({ className, description, title, ...props }: EmptyStateProps) {
  return (
    <Card className={classNames('ui-empty-state', className)} {...props}>
      <h2>{title}</h2>
      <p>{description}</p>
    </Card>
  )
}
