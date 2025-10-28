import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DetalleJugador = () => {

    const { id } = useParams();

    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const loadPlayer = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:3000/api/players/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                if (data.success) {
                    setPlayer(data.player);
                }
            } catch (error) {
                console.error("Error loading player:", error);
            }
        };

        loadPlayer();
    }, [id]);

    return (


        <div className="contenedor-detalles">
            {player &&
                <div className="contenido-detalles">

                    <h1>{player.name}</h1>
                    <img src={`http://localhost:3000${player.imageUrl}`} alt="" />

                </div>
            }


        </div>


    )
}

export default DetalleJugador