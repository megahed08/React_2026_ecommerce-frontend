import type { LabelHTMLAttributes, ReactNode } from 'react'
import { classNames } from '../../utils/classNames'

interface FieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  label: string
}

export function Field({ children, className, label, ...props }: FieldProps) {
  return (
    <label className={classNames('ui-field', className)} {...props}>
      <span>{label}</span>
      {children}
    </label>
  )
}
