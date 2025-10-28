import { useState,useEffect } from 'react'

const card = () => {

    const [players,setPlayers] = useState({});

    useEffect(() => {

        const fetchData = async () => {
            const res = await fetch('');
            const data = await res.json();
            setPlayers(data);
        }

        fetchData()

    },[])
    console.log(players);
    

  return (
    <div className='card-contenedor'>
    
    <h1>a</h1>
    
    
    </div>
  )
}

export default card