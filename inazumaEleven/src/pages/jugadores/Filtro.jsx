
const Filtro = ({ posicion, setPosicion, elemento, setElemento, setPage, setBuscarNombre, buscarNombre }) => {

    const limpiarFiltro = () => {
        setPosicion("");
        setElemento("");
        setBuscarNombre("");
        setPage(1);
    }

    const applyFilterPosicion = (e) => {
        setPosicion(e.target.value);
        setPage(1);
    };

    const applyFilterElemento = (e) => {
        setElemento(e.target.value);
        setPage(1);
    };

    const applyFilterBuscar = (e) => {
        setBuscarNombre(e.target.value);
        setPage(1);
    };

    return (
        <div className="filtros">

            <form onSubmit={(e) => e.preventDefault()}>

                <input
                    type="search"
                    placeholder="Buscar jugador"
                    value={buscarNombre}
                    onChange={applyFilterBuscar}
                />

            </form>


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
    )
}

export default Filtro