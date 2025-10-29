import './filtro.css';
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
                <option value="PR">PR</option>
                <option value="DL">DL</option>
                <option value="DF">DF</option>
                <option value="MD">MD</option>
                <option value="DT">DT</option>
            </select>

            <select value={elemento} onChange={applyFilterElemento}>
                 <option value="">Todos</option>
                <option value="fuego">Fuego</option>
                <option value="viento">Viento</option>
                <option value="montaña">Montaña</option>
                <option value="bosque">Bosque</option>
            </select>



            <button onClick={limpiarFiltro}>Limpiar</button>



        </div>
    )
}

export default Filtro