import { useState, useEffect } from 'react';
import './home.css';

function Home() {

  const [contador, setContador] = useState(1);
 
  useEffect(() => {
    const intervalo = setInterval(() => {
      setContador(c => c === 3 ? 1 : c + 1);
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);


  return (
    <div className='home-contendor'>

      <div className='home-imagenes'>
            <img className='img' src={`fondo${contador}.webp`} alt="foto" />
      </div>

    </div>
  )
}

export default Home