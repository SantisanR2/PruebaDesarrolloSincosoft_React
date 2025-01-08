import React, { useState } from 'react';
import ModalForm from './Componentes/ModalForm';
import Navbar from './Componentes/Navbar';
import TablaTareas from './Componentes/TablaTareas';
import './App.css';
import axios from 'axios';
import { API_URL } from './config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('crear-tarea');
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [selectedSubtarea, setSelectedSubtarea] = useState(null);
  const [search, setSearch] = useState('');

  // Maneja el abrir un formulario o la selección de una tarea/subtarea
  const handleOpen = (mode, tarea = null, subtarea = null) => {
    setModalMode(mode);
    setSelectedTarea(tarea);
    setSelectedSubtarea(subtarea);
    setIsOpen(true);
  };

  // Maneja la selección de una tarea
  const handleSelectTarea = (tarea) => {
    setSelectedTarea(tarea);
  };

  // Maneja el enviar un formulario
  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'crear-tarea') {
        await axios.post(`${API_URL}/tarea`, formData);
        toast.success('Tarea creada con éxito');
      } else if (modalMode === 'crear-subtarea') {
        await axios.post(`${API_URL}/subtarea`, formData);
        toast.success('Subtarea creada con éxito');
      } else if (modalMode === 'editar-tarea') {
        await axios.put(`${API_URL}/tarea/${formData.tareaId}`, formData);
        toast.success('Tarea editada con éxito');
      } else if (modalMode === 'editar-subtarea') {
        await axios.put(`${API_URL}/subtarea/${formData.subtareaId}`, formData);
        toast.success('Subtarea editada con éxito');
      }
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error al enviar la solicitud:', error); 
      toast.error('Ocurrió un error al enviar la solicitud');
    }
  };

  // Maneja la eliminación de una tarea
  const handleDeleteTarea = async (tareaId) => {
    try {
      await axios.delete(`${API_URL}/tarea/${tareaId}`);
      toast.success('Tarea eliminada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      toast.error('Ocurrió un error al eliminar la tarea');
    }
  };

  // Maneja la eliminación de una subtarea
  const handleDeleteSubtarea = async (subtareaId) => {
    try {
      await axios.delete(`${API_URL}/subtarea/${subtareaId}`);
      toast.success('Subtarea eliminada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error al eliminar la subtarea:', error);
      toast.error('Ocurrió un error al eliminar la subtarea');
    }
  };

  return (
    <>
      <Navbar onOpen={() => handleOpen('crear-tarea')} onSearch={setSearch} />
      <div className="form-control ml-2 block lg:hidden">
          <input type="text" placeholder="Buscar" onChange={(e) => setSearch(e.target.value)} className="input input-bordered w-48" />
      </div>
      <TablaTareas 
        onEditTarea={(tarea) => handleOpen('editar-tarea', tarea)} 
        onEditSubtarea={(subtarea) => handleOpen('editar-subtarea', selectedTarea, subtarea)}
        onCreateSubtarea={(tarea) => handleOpen('crear-subtarea', tarea)}
        onDeleteTarea={handleDeleteTarea}
        onDeleteSubtarea={handleDeleteSubtarea}
        onSelectTarea={handleSelectTarea}
        search={search}
      />
      <ModalForm 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        mode={modalMode}
        tarea={selectedTarea}
        subtarea={selectedSubtarea}
        onSubmit={handleSubmit} 
      />
      <ToastContainer />
    </>
  );
}

export default App;
