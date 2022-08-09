import { createRoot } from 'react-dom/client'

import Router from './Router'
import 'react-toastify/dist/ReactToastify.css'
import './styles/styles.scss'

const container = document.getElementById('root')

if (container) {
  const root = createRoot(container)
  root.render(<Router />)
}
