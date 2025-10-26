import { Link, useNavigate } from "react-router-dom";
import './navbar.css';
import { useState } from "react";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const cerrarSesion = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        
        setMenu(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="menu-desplegable">
     
      <img
        src="btn_menu_sp.png"
        alt="boton"
        className="boton-menu"
        onClick={toggleMenu}
      />


      {menu && <div className="backdrop" onClick={toggleMenu}></div>}


      <div className={`navegador-contenedor ${menu ? "activo" : ""}`}>
        <ul className="navegador-enlaces">

          <li className="navegador-links">
            <Link className="enlace" to={"/juegadores"} onClick={toggleMenu}>Jugadores</Link>
          </li>

          <li className="navegador-links">
            <Link className="enlace" to={"/objetos"} onClick={toggleMenu}>Objetos</Link>
          </li>

          <li className="navegador-links">
            <Link className="enlace" to={"/equipos"} onClick={toggleMenu}>Equipos</Link>
          </li>

          <li className="navegador-links">
            <Link className="enlace" to={"/crearEquipo"} onClick={toggleMenu}>Crear Equipo</Link>
          </li>

          <li className="navegador-links">
            <Link className="enlace-cerrar" to={"/crearEquipo"} onClick={cerrarSesion}>Cerrar Sesion</Link>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Navbar;
