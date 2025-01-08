import React, { useState, useEffect } from 'react';

export default function ModalForm({ isOpen, onClose, mode, tarea, subtarea, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    etiqueta: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode.includes('crear')) {
        setFormData({
          nombre: '',
          descripcion: '',
          etiqueta: ''
        });
      } else {
        setFormData({
          nombre: subtarea ? subtarea.nombre : tarea?.nombre || '',
          descripcion: tarea?.descripcion || '',
          etiqueta: tarea?.etiqueta || ''
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, tarea, subtarea]);

  if (!isOpen) return null;

  const isSubtarea = mode.includes('subtarea');
  const isCreate = mode.includes('crear');

  // Maneja el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Valida el formulario
  const validate = () => {
    const newErrors = {};
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede tener más de 100 caracteres';
    }
    if (formData.descripcion.length > 255) {
      newErrors.descripcion = 'La descripción no puede tener más de 255 caracteres';
    }
    if (formData.etiqueta.length > 50) {
      newErrors.etiqueta = 'La etiqueta no puede tener más de 50 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manda el Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    let dataToSubmit = { ...formData };

    if (isSubtarea && isCreate) {
      dataToSubmit = { nombre: formData.nombre, tareaId: tarea.tareaId }; // Solo nombre y tareaId al crear una subtarea
    } else if (isSubtarea && !isCreate) {
      dataToSubmit = { nombre: formData.nombre, tareaId: tarea.tareaId, subtareaId: subtarea.subtareaId }; // Solo nombre, tareaId y subtareaId al editar una subtarea
    } else if (!isSubtarea && !isCreate) {
      dataToSubmit = { ...formData, tareaId: tarea.tareaId }; // Nombre, descripción, etiqueta y tareaId al editar una tarea
    }

    onSubmit(dataToSubmit);
  };

  return (
    <dialog id="my_modal_3" className="modal bg-black/40" open={isOpen}>
      <div className="modal-box">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
        <h3 className="font-bold text-lg py-4">{isCreate ? 'Crear' : 'Editar'} {!isSubtarea ? 'Tarea' : 'Subtarea'}</h3>
        
        <form onSubmit={handleSubmit}>
          {/* TAREAS Y SUBTAREAS */}  
          <input 
            type="text" 
            name="nombre"
            placeholder={`Nombre de la ${!isSubtarea ? 'tarea' : 'subtarea'}`} 
            className="input input-bordered w-full mb-2" 
            value={formData.nombre} 
            onChange={handleChange}
          />
          {errors.nombre && <p className="text-red-500">{errors.nombre}</p>}

          {/* SOLO TAREAS */}
          {!isSubtarea && (
            <>
              <input 
                type="text" 
                name="descripcion"
                placeholder="Descripción de la tarea (Opcional)" 
                className="input input-bordered w-full mb-2" 
                value={formData.descripcion} 
                onChange={handleChange}
              />
              {errors.descripcion && <p className="text-red-500">{errors.descripcion}</p>}
              <input 
                type="text" 
                name="etiqueta"
                placeholder="Etiqueta (Opcional)" 
                className="input input-bordered w-full mb-2" 
                value={formData.etiqueta} 
                onChange={handleChange}
              />
              {errors.etiqueta && <p className="text-red-500">{errors.etiqueta}</p>}
            </>
          )}

          <button type="submit" className="btn btn-success">
            {isCreate ? 'Agregar' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </dialog>
  );
}
