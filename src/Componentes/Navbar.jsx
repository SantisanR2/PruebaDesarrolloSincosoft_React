export default function Navbar({onOpen, onSearch}) {

    // Maneja la búsqueda
    const handleSearch = (e) => {
        onSearch(e.target.value);
    }

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <a className="font-bold text-3xl">Manejador de Tareas</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <div className="form-control">
                    <input type="text" placeholder="Buscar" onChange={handleSearch} className="input input-bordered w-24 md:w-auto" />
                </div>
            </div>
            <div className="navbar-end">
                <button className="btn btn-primary" onClick={onOpen}>Crear nueva tarea</button>
            </div>
        </div>
    );
}