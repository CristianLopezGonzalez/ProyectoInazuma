import { useState, useEffect } from "react";
import "./jugadores.css";
import Filtro from "./Filtro";
import { NavLink } from "react-router-dom";

const Jugadores = () => {
  const [players, setPlayers] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errores, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [posicion, setPosicion] = useState("");
  const [elemento, setElemento] = useState("");
  const [buscarNombre, setBuscarNombre] = useState("");

  useEffect(() => {
    const loadPlayers = async () => {
      setCargando(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
        });

        if (elemento) params.append("element", elemento);
        if (posicion) params.append("position", posicion);
        if (buscarNombre) params.append("search", buscarNombre);

        const res = await fetch(
          `http://localhost:3000/api/players?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Error al obtener jugadores");

        if (!data.players || data.players.length === 0) {
          setPlayers([]);
          setPages(1);
          setError(new Error("No se ha encontrado ningún jugador"));
          return;
        }

        setPlayers(data.players);
        setPages(data.pages || 1);
        console.log(data.players);
        
      } catch (error) {
        setError(error);
      } finally {
        setCargando(false);
      }
    };

    loadPlayers();
  }, [page, posicion, elemento, buscarNombre]);
//background-color: rgb(126, 190, 241);
  return (
    <div className="contenedor-principal">
      <div className="contenedor-filtro">
        <div className="filtro">
          <Filtro
            posicion={posicion}
            elemento={elemento}
            buscarNombre={buscarNombre}
            setBuscarNombre={setBuscarNombre}
            setPosicion={setPosicion}
            setElemento={setElemento}
            setPage={setPage}
          />
        </div>
      </div>

      <div className="contenedor-jugadores">
        <div>
          {cargando && <div className="mensaje-carga">Cargando...</div>}
          {errores && <div className="mensaje-error">{errores.message}</div>}
        </div>

        {!cargando && !errores && players.length > 0 && (
          <>
            {players.map((p) => (
              <div key={p._id} className="jugador-individual">
                <div className="cabecera">
                  <div className="contenedor-imagen">
                    <img className="imagenes-players" src={`http://localhost:3000${p.imageUrl}`} alt={p.name}/>
                  </div>
                  <div className="contenedor-nombre">
                    <h2 className="nombre-jugador">{p.name}</h2>
                  </div>
                </div>

                <div className="contenedor-descriptcion">
                  <div className="descripcion">
                    <span className="descripcion-player">{p.description}</span>
                  </div>
                </div>

                <div className="contenedor-estadisticas">
                  <div className="stat-contenedor">
                    <div className="contenedor-nombre-stat"><h2 className="nom-stat">POSICION</h2></div>
                    <div className="contenedor-stats"><h2 className="stat">{p.position}</h2></div>
                  </div>

                  <div className="stat-contenedor">
                    <div className="contenedor-nombre-stat"><h2 className="nom-stat">ELEMENTO</h2></div>
                    <div className="contenedor-stats"><h2 className="stat">{p.element}</h2></div>
                  </div>

                  <div className="stat-contenedor">
                    <div className="contenedor-nombre-stat"><h2 className="nom-stat">Numero</h2></div>
                    <div className="contenedor-stats"><h2 className="stat">{p.number}</h2></div>
                  </div>

                  <div className="stat-contenedor">
                    <div className="contenedor-nombre-stat"><h2 className="nom-stat">agilidad</h2></div>
                    <div className="contenedor-stats"><h2 className="stat">{p.stats["agilidad"]}</h2></div>
                  </div>

                  <div className="stat-contenedor">
                    <div className="contenedor-nombre-stat"><h2 className="nom-stat">control</h2></div>
                    <div className="contenedor-stats"><h2 className="stat">{p.stats["control"]}</h2></div>
                  </div>

                  <div className="stat-contenedor">
                    <div className="contenedor-nombre-stat"><h2 className="nom-stat">inteligencia</h2></div>
                    <div className="contenedor-stats"><h2 className="stat">{p.stats["inteligencia"]}</h2></div>
                  </div>

                  <div className="stat-contenedor">
                    <div className="contenedor-nombre-stat"><h2 className="nom-stat">fisico</h2></div>
                    <div className="contenedor-stats"><h2 className="stat">{p.stats["fisico"]}</h2></div>
                  </div>

                  <div className="stat-contenedor">
                    <div className="contenedor-nombre-stat"><h2 className="nom-stat">patada</h2></div>
                    <div className="contenedor-stats"><h2 className="stat">{p.stats["patada"]}</h2></div>
                  </div>

                  <div className="stat-contenedor">
                    <div className="contenedor-nombre-stat"><h2 className="nom-stat">precision</h2></div>
                    <div className="contenedor-stats"><h2 className="stat">{p.stats["precision"]}</h2></div>
                  </div>

                  <div className="stat-contenedor">
                    <div className="contenedor-nombre-stat"><h2 className="nom-stat">tecnica</h2></div>
                    <div className="contenedor-stats"><h2 className="stat">{p.stats["tecnica"]}</h2></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {!errores && !cargando && players.length > 0 && (
          <div className="pagination">
            <button
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
            >
              Anterior
            </button>

            <span>
              Página {page} de {pages}
            </span>

            <button
              onClick={() => page < pages && setPage(page + 1)}
              disabled={page === pages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jugadores;
