import { StorefrontLayout } from './components/layout/StorefrontLayout'
import { useStorefront } from './hooks/useStorefront'
import './App.css'

function App() {
  const storefront = useStorefront()

  return <StorefrontLayout storefront={storefront} />
}

export default App
