import React, { useState } from 'react';
import { Global } from '../../helpers/Global';

export const AgregarAulas = () => {
  const [aula, setAula] = useState({ nombre: '', capacidad: '', bloque: '', planta: '', descripcion: '' });
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleInputChange = (e) => {
    setAula({ ...aula, [e.target.name]: e.target.value });
  };

  const crearAula = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(Global.url + 'aula/crear-aula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(aula)
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Aula creada correctamente');
        setAula({ nombre: '', capacidad: '', bloque: '', planta: '', descripcion: '' });
      } else {
        setError('Error al crear el aula');
      }
    } catch (err) {
      console.error(err);
      setError('Error en el servidor');
    }
  };

  return (
    <div className="centered-container">
      <div className="form-container">
        <h2>Establecer Aulas Disponibles</h2>
        {error && <p>{error}</p>}

        <form onSubmit={crearAula}>
          <div>
            <label>Nombre del Aula</label>
            <input
              type="text"
              name="nombre"
              value={aula.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Capacidad del Aula</label>
            <input
              type="text"
              name="capacidad"
              value={aula.capacidad}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Bloque</label>
            <input
              type="text"
              name="bloque"
              value={aula.bloque}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Planta</label>
            <input
              type="text"
              name="planta"
              value={aula.planta}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={aula.descripcion}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Crear Aula</button>
        </form>
      </div>
    </div>
  );
};
