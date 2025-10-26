import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './login.css';
const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [exitoso, setExitoso] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMensaje('Completa todos los campos');
      setExitoso(false);
      return;
    }

    try {

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Sesion iniciada correctamente')
        setExitoso(true);

        if (data.token) {
          console.log('Token:', data.token);
          console.log('Usuario:', data.user);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setTimeout(() => {
          setEmail('');
          setPassword('');
          setMensaje('');
          navigate('/home');
        }, 1000);

      } else {
        setMensaje('Error al iniciar sesión');
        setExitoso(false);
      }

    } catch (error) {
      console.error('Error de conexión:', error);
      setMensaje('Error de conexión con el servidor');
      setExitoso(false);
    }

  };

  return (
    <div className="login-contenedor">
      <div className="login-parte-izquierda">

        

        <div className="contenedor-form">
          <img src="/logoIna.png" alt="" width={400} height={300} />

          {mensaje && (<div className={exitoso ? 'login-correcto' : 'login-incorrecto'}>  {mensaje} </div>)}

          <form className="formulario" onSubmit={handleSubmit}>

            <label>Email</label>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Iniciar Sesion</button>

          </form>

          <span className="subtitulo-login-link">¿Aun no tienes cuenta?
            <Link to={'/register'} className="login-link">
              <span>Crear cuenta</span>
            </Link>
          </span>

        </div>
      </div>



      <div className="login-parte-derecha"></div>

    </div>


  )
}

export default Login


