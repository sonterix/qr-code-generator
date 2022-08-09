import { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Generator from './components/Generator'

const Router: FC = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Generator />} />
      </Routes>
    </BrowserRouter>

    <ToastContainer position="bottom-left" autoClose={3000} />
  </>
)

export default Router
