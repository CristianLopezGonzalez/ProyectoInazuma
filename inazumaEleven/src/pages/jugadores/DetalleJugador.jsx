import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './detalles.css';
const DetalleJugador = () => {

    const { id } = useParams();

    const [player, setPlayer] = useState(null);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);

    //`http://localhost:3000/api/players/${id}`

    useEffect(() => {

        const fetchPlayer = async () => {

            try {

                const token = localStorage.getItem('token');

                const res = await fetch(`http://localhost:3000/api/players/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                if (!res.ok) {
                    throw new Error('Error en el fetch')
                }

                const data = await res.json();

                if (data.success) {
                    setPlayer(data.player);
                    console.log(data.player);

                } else {
                    throw new Error(data.message || 'Error fetching player data');
                }

            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }

        }

        fetchPlayer();
    }, [id])

    if (cargando) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    // fotos `http://localhost:3000${player.imageUrl}`
    return (


        <div className="contenedor-detalles">
            <div className="cabecera">

                <div className="cont-foto">
                    <img src={`http://localhost:3000${player.imageUrl}`} alt="a" />
                </div>


                <div className="cont-nombre">
                    <h1>{player.name}</h1>
                </div>

            </div>

            <div className="sub-cabecera">
                <div className="posicion-elemento">
                    {console.log(player.position)
                    }
                    <img className="img1" src={`/${player.position}.jpg`} width={40} alt="" />
                    <img className="img2" src={`/${player.element}.png`} alt="a" width={30} height={30} />



                </div>
                <div className="descripcion">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate rem suscipit in, perspiciatis nemo, laudantium fuga quibusdam sunt commodi doloremque temporibus consequuntur quis voluptatem soluta aliquam ab laboriosam cum amet!</p>
                </div>
            </div>

            <div className="parte-baja">
                <div className="caja1">texto1</div>
                <div className="caja2">texto2</div>
                <div className="caja3">texto3</div>
            </div>

        </div>


    )
}

export default DetalleJugador