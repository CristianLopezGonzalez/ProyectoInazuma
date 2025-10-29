
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
                <option value="GK">PR</option>
                <option value="FW">DL</option>
                <option value="DF">DF</option>
                <option value="MF">MD</option>
                <option value="MF">DT</option>
            </select>

            <select value={elemento} onChange={applyFilterElemento}>
                 <option value="">Todas</option>
                <option value="Fire">Fuego</option>
                <option value="Wind">Viento</option>
                <option value="Mountain">Montaña</option>
                <option value="Wood">Planta</option>
            </select>



            <button onClick={limpiarFiltro}>Limpiar</button>



        </div>
    )
}

export default Filtro