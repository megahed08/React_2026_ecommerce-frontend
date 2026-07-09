import type { FormEvent } from 'react'
import type { AuthMode, Order, User } from '../../types'
import { currency } from '../../utils/currency'
import { Button, Chip, Eyebrow, Field } from '../ui'

interface AccountViewProps {
  authMode: AuthMode
  order: Order | null
  user: User | null
  onAuthModeChange: (mode: AuthMode) => void
  onAuthSubmit: (event: FormEvent<HTMLFormElement>) => void
  onLogout: () => void
}

export function AccountView({
  authMode,
  onAuthModeChange,
  onAuthSubmit,
  onLogout,
  order,
  user,
}: AccountViewProps) {
  if (user) {
    return (
      <section className="account-view" aria-labelledby="account-title">
        <div>
          <Eyebrow>Account</Eyebrow>
          <h1 id="account-title">Welcome, {user.name}</h1>
          <p>{user.email}</p>
          <Chip tone="accent">{user.role}</Chip>
          <Button variant="secondary" onClick={onLogout}>
            Log out
          </Button>
        </div>

        <div className="order-history">
          <h2>Recent order</h2>
          {order ? (
            <p>
              {order.id} - {currency.format(order.total)}
            </p>
          ) : (
            <p>No orders yet.</p>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="auth-view" aria-labelledby="auth-title">
      <div>
        <Eyebrow>Customer access</Eyebrow>
        <h1 id="auth-title">{authMode === 'login' ? 'Log in' : 'Create account'}</h1>
        <p>Use any email. Include admin in the email to preview the admin role state.</p>
      </div>

      <form className="auth-form" onSubmit={onAuthSubmit}>
        {authMode === 'register' && (
          <Field label="Name">
            <input name="name" placeholder="Your name" />
          </Field>
        )}

        <Field label="Email">
          <input required name="email" type="email" placeholder="you@example.com" />
        </Field>

        <Field label="Password">
          <input required name="password" type="password" placeholder="Password" />
        </Field>

        <Button type="submit" variant="primary">
          {authMode === 'login' ? 'Log in' : 'Register'}
        </Button>

        <Button
          variant="ghost"
          onClick={() => onAuthModeChange(authMode === 'login' ? 'register' : 'login')}
        >
          {authMode === 'login' ? 'Create a new account' : 'Use an existing account'}
        </Button>
      </form>
    </section>
  )
}
