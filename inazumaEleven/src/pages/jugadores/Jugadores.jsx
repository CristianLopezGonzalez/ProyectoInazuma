import { useState, useEffect } from "react";
import "./jugadores.css";
import Filtro from "./Filtro";
import { NavLink } from "react-router-dom";

const Jugadores = () => {
  const [players, setPlayers] = useState([]);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [posicion, setPosicion] = useState("");
  const [elemento, setElemento] = useState("");
  const [buscarNombre, setBuscarNombre] = useState("");

  
  const loadPlayers = async () => {
    const token = localStorage.getItem("token");

    const params = new URLSearchParams({
      page: page.toString(),
      limit: "12",
    });

    if (elemento) params.append("element", elemento);
    if (posicion) params.append("position", posicion);
    if (buscarNombre) params.append("search", buscarNombre);

    const res = await fetch(
      `http://localhost:3000/api/players?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();

    if (data.success) {
      setPlayers(data.players);
      setPages(data.pages);
    }
  };

  
  useEffect(() => {
    loadPlayers();
  }, [page, posicion, elemento, buscarNombre]);

  return (
    <div className="contenedor-principal">
      <div className="layout-jugadores">
        {/* Filtros */}
        <aside className="lado-izquierdo">
          
          <Filtro
            posicion={posicion}
            elemento={elemento}
            buscarNombre={buscarNombre}
            setBuscarNombre={setBuscarNombre}
            setPosicion={setPosicion}
            setElemento={setElemento}
            setPage={setPage}
          />

        </aside>

        {/* Jugadores*/}
        <main className="lado-derecho">
          <div className="jugadores">
            <div className="players-container">

              {players.map((p) => (
                <div key={p._id} className="tarjeta-player">
                  <div className="contenedor-foto-nombre">
                    <div className="contenedor-imagen">

                      <NavLink to={`/jugador/${p.id}`} ><img
                        className="imagen-player"
                        src={`http://localhost:3000${p.imageUrl}`}
                        alt={p.name}/>
                      </NavLink>

                    </div>
                    <h2 className="nombre-player">{p.name}</h2>
                  </div>
                </div>
                
              ))}

            </div>

            
            
          </div>

              <div className="pagination">
              <button onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1}>Anterior</button>

              <span>Página {page} de {pages}</span>

              <button onClick={() => page < pages && setPage(page + 1)}disabled={page === pages}>Siguiente</button>
            </div>
        </main>
      </div>
    </div>
  );
};

export default Jugadores;
