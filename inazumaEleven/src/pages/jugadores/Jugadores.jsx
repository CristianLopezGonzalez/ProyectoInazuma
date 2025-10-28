import { useState, useEffect } from "react";
import "./jugadores.css";

const Jugadores = () => {
  const [players, setPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  //para los filtros
  const [posicion, setPosicion] = useState("");
  const [elemento, setElemento] = useState("");


  const loadPlayers = async () => {
    const token = localStorage.getItem("token");


    //construir url
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "20",
    });
    if (elemento) params.append("element", elemento);
    if (posicion) params.append("position", posicion);
    

    const res = await fetch(`http://localhost:3000/api/players?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` }, }
    );

    const data = await res.json();
    if (data.success) {
      setPlayers(data.players);
      setPages(data.pages);
    }
  };

  // Se ejecuta cada vez que cambie la página o el filtro
  useEffect(() => {
    loadPlayers();
  }, [page, posicion,elemento]);


  const limpiarFiltro = () => {
    setPosicion("");
    setElemento("");
  }

  const applyFilterPosicion = (e) => {
    setPosicion(e.target.value);
    setPage(1);
  };

   const applyFilterElemento = (e) => {
    setElemento(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <div className="filtros">
        <select value={posicion} onChange={applyFilterPosicion}>
          <option value="">Todas</option>
          <option value="GK">GK</option>
          <option value="FW">FW</option>
          <option value="MF">MF</option>
        </select>

        <select value={elemento} onChange={applyFilterElemento}>
          <option value="">Todas</option>
          <option value="Fire">Fire</option>
          <option value="Wind">Wind</option>
          <option value="Mountain">Mountain</option>
        </select>

        <button onClick={limpiarFiltro}>Limpiar</button>
      </div>

      <div className="pagination">
        <button onClick={() => page > 1 ? setPage(page - 1) : null} disabled={page === 1}>
          Anterior
        </button>
        <span>Página {page} de {pages}</span>
        <button onClick={() => page < pages ? setPage(page + 1) : null} disabled={page === pages}>
          Siguiente
        </button>
      </div>

      <div className="players-container">
        {players.map((p) => (
          <div key={p._id || p.name} className="tarjeta-player">
            <h3>{p.name}</h3>
            <img src={`http://localhost:3000${p.imageUrl}`} alt={p.name} />
            <p>{p.team} • {p.position} / {p.element}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jugadores;
