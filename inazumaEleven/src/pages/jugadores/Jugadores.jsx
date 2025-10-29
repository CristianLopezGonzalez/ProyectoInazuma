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
          limit: "40",
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

        if (!res.ok) throw new Error(data.message || "Error al obtener jugadores");

        if (!data.players || data.players.length === 0) {
          setPlayers([]);
          setPages(1);
          setError(new Error("No se ha encontrado ningún jugador"));
          return;
        }

        setPlayers(data.players);
        setPages(data.pages || 1);
      } catch (error) {
        setError(error);
      } finally {
        setCargando(false);
      }
    };


    loadPlayers();
  }, [page, posicion, elemento, buscarNombre]);

  return (
    <div className="contenedor-principal">



      <div className="contenedor-filtro">

        <aside className="filtro">
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
      </div>


      <div>
        {cargando && <div className="mensaje-carga">Cargando...</div>}

        {errores && (<div className="mensaje-error">{errores.message}</div>)}
      </div>

      <div className="contenedor-jugadores">
        {!cargando && !errores && (

          <div className="info-jugadores">

            {players.map((p) => (

                <img className="img" src={`http://localhost:3000${p.imageUrl}`} alt={p.name} />

              ))}
          </div>

        )}

        {!errores && !cargando && players.length > 0 && (
          <div className="pagination">
            <button
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
            >
              Anterior
            </button>

            <span>Página {page} de {pages}</span>

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
