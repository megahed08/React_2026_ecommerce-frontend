import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { classNames } from '../../utils/classNames'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'nav' | 'brand' | 'media' | 'quantity'
type ButtonSize = 'sm' | 'md' | 'square'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: ReactNode
  size?: ButtonSize
  variant?: ButtonVariant
}

export function Button({
  active = false,
  children,
  className,
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'ui-button',
        `ui-button--${variant}`,
        `ui-button--${size}`,
        active && 'ui-button--active',
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
