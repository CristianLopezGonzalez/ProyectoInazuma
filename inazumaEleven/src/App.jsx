import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import ProtectedRoutes from './components/protectedRoutes/ProtectedRoutes'
import Navbar from './components/navbar/Navbar'

const App = () => {
  return (

    <BrowserRouter>


      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={
          <ProtectedRoutes>
            <Navbar/>
            <Home />
          </ProtectedRoutes>
        } />
      </Routes>


    </BrowserRouter>

  )
}

export default App