import { useState, type FormEvent } from 'react'
import type { AuthMode, User } from '../types'

export function useAccount(onAuthenticated: () => void) {
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [user, setUser] = useState<User | null>(null)

  function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const emailValue = form.get('email')
    const nameValue = form.get('name')

    if (typeof emailValue !== 'string') return

    const name =
      typeof nameValue === 'string' && nameValue.trim().length > 0
        ? nameValue
        : emailValue.split('@')[0]

    setUser({
      name,
      email: emailValue,
      role: emailValue.includes('admin') ? 'ADMIN' : 'CUSTOMER',
    })
    onAuthenticated()
  }

  function logout() {
    setUser(null)
  }

  return {
    authMode,
    user,
    handleAuthSubmit,
    logout,
    setAuthMode,
  }
}
