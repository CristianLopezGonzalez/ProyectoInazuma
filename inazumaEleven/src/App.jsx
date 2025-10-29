import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import ProtectedRoutes from './components/protectedRoutes/ProtectedRoutes'
import Navbar from './components/navbar/Navbar'
import Jugadores from './pages/jugadores/Jugadores'
import Objetos from './pages/objetos/Objetos'
import CrearEquipo from './pages/crearEquipo/CrearEquipo'
import Equipos from './pages/equipos/Equipo'



const ProtectedLayout = () => {
  return (
    <ProtectedRoutes>
      <Navbar />
      <Outlet />
    </ProtectedRoutes>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        
        <Route element={<ProtectedLayout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/jugadores' element={<Jugadores />} />
          <Route path='/objetos' element={<Objetos />} />
          
          <Route path='/crearEquipo' element={<CrearEquipo />} />
          <Route path='/equipos' element={<Equipos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App