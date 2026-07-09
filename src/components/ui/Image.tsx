import type { ImgHTMLAttributes, SyntheticEvent } from 'react'
import { classNames } from '../../utils/classNames'

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23edf3f1'/%3E%3Crect x='260' y='190' width='280' height='220' rx='24' fill='%23d6e2dc'/%3E%3Ccircle cx='330' cy='260' r='34' fill='%23f7faf8'/%3E%3Cpath d='M290 374l78-86 58 62 36-38 72 62H290z' fill='%23ffffff'/%3E%3Ctext x='400' y='470' text-anchor='middle' font-family='Arial, sans-serif' font-size='34' font-weight='700' fill='%236b7772'%3EImage unavailable%3C/text%3E%3C/svg%3E"

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fit?: 'contain' | 'cover'
}

export function Image({ alt, className, fit = 'cover', loading = 'lazy', src, ...props }: ImageProps) {
  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget

    if (image.dataset.fallbackApplied === 'true') return

    image.dataset.fallbackApplied = 'true'
    image.src = fallbackImage
  }

  return (
    <img
      alt={alt}
      className={classNames('ui-image', `ui-image--${fit}`, className)}
      loading={loading}
      onError={handleError}
      src={src}
      {...props}
    />
  )
}
