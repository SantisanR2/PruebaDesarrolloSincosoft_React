import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TablaTareas({ onEditTarea, onEditSubtarea, onCreateSubtarea, onDeleteTarea, onDeleteSubtarea, onSelectTarea, search }) {
    const [tareas, setTareas] = useState([]);
    const [selectedTareaId, setSelectedTareaId] = useState(null);

    useEffect(() => {
        // Función para obtener las tareas de la API
        const fetchTareas = async () => {
            try {
                const response = await axios.get(`${API_URL}/tarea`); 
                setTareas(response.data);
            } catch (error) {
                console.error('Error al obtener las tareas:', error);
                toast.error('Ocurrió un error al obtener las tareas');
            }
        };

        fetchTareas();
    }, []);

    // Maneja la selección de una tarea
    const handleSelectTarea = (tarea) => {
        if (selectedTareaId === tarea.tareaId) {
            setSelectedTareaId(null);
            onSelectTarea(null);
        } else {
            setSelectedTareaId(tarea.tareaId);
            onSelectTarea(tarea);
        }
    };

    // Maneja el filtro de tareas
    const filterTareas = tareas.filter(tarea => (
        tarea.nombre.toLowerCase().includes(search.toLowerCase()) ||
        tarea.etiqueta?.toLowerCase().includes(search.toLowerCase())
    ));

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Etiqueta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filterTareas.map((tarea, index) => (
                        <React.Fragment key={tarea.tareaId}>
                            {/* TAREAS */}
                            <tr className="hover cursor-pointer" onClick={() => handleSelectTarea(tarea)}>
                                <th>{index + 1}</th>
                                <td>{tarea.nombre}</td>
                                <td>{tarea.descripcion}</td>
                                <td>{tarea.etiqueta}</td>
                                <td>
                                    <button className="btn btn-xs btn-primary mr-2 block mt-2" onClick={(e) => { e.stopPropagation(); onEditTarea(tarea); }}>Editar</button>
                                    <button className="btn btn-xs btn-danger block mt-2" onClick={(e) => { e.stopPropagation(); onDeleteTarea(tarea.tareaId); }}>Borrar</button>
                                    <button className="btn btn-xs btn-secondary block mt-2" onClick={(e) => { e.stopPropagation(); onCreateSubtarea(tarea); }}>Crear Subtarea</button>
                                </td>
                            </tr>
                            {/* SUBTAREAS */}
                            {selectedTareaId === tarea.tareaId && tarea.subtareas && tarea.subtareas.length > 0 && (
                                <tr>
                                    <td colSpan="5">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Subtarea Nombre</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tarea.subtareas.map((subtarea, subIndex) => (
                                                    <tr key={subtarea.subtareaId}>
                                                        <th>{index + 1}.{subIndex + 1}</th>
                                                        <td>{subtarea.nombre}</td>
                                                        <td>
                                                            <button className="btn btn-xs btn-primary mr-2 block mt-2" onClick={(e) => { e.stopPropagation(); onEditSubtarea(subtarea); }}>Editar</button>
                                                            <button className="btn btn-xs btn-danger block mt-2" onClick={(e) => { e.stopPropagation(); onDeleteSubtarea(subtarea.subtareaId); }}>Borrar</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
