type ClassValue = false | null | string | undefined

export function classNames(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(' ')
}
