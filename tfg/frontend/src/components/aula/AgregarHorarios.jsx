import React, { useState, useEffect } from 'react';
import { Global } from '../../helpers/Global';

export const AgregarHorarios = () => {
  const [aulas, setAulas] = useState([]);
  const [aulaSeleccionada, setAulaSeleccionada] = useState('');
  const [horarios, setHorarios] = useState([{ dia: '', horaInicio: '', horaFin: '' }]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Obtener aulas disponibles
  const obtenerAulas = async () => {
    try {
      const response = await fetch(Global.url + 'aula/listar-aulas', {
        method: 'GET',
      });

      const data = await response.json();
      if (data.status === 'success') {
        setAulas(data.aulas);
      } else {
        setError('Error al obtener aulas');
      }
    } catch (err) {
      console.error(err);
      setError('Error en el servidor');
    }
  };

  useEffect(() => {
    obtenerAulas();
  }, []);

  // Manejar el cambio de los campos de horarios
  const handleHorarioChange = (index, e) => {
    const { name, value } = e.target;
    const newHorarios = [...horarios];

    newHorarios[index][name] = value;
    setHorarios(newHorarios);
  };

  // Combina la fecha y la hora en un objeto Date sin modificar la zona horaria
  const crearFechaConHora = (fecha, hora) => {
    const [hours, minutes] = hora.split(':');
    const fechaConHora = new Date(fecha); // Usar la fecha seleccionada (campo 'dia')

    fechaConHora.setHours(hours, minutes, 0, 0); // Añadir la hora y minutos sin modificar el timezone
    return fechaConHora;
  };

  // Enviar los horarios seleccionados
  const enviarHorarios = async (e) => {
    e.preventDefault();

    try {
      // Llamada para actualizar los horarios
      const response = await fetch(Global.url + 'aula/actualizar-horarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          aulaId: aulaSeleccionada,
          horariosDisponibles: horarios.map(horario => ({
            dia: new Date(horario.dia), // Mantener la fecha como Date
            horaInicio: crearFechaConHora(horario.dia, horario.horaInicio), // Combinar fecha con horaInicio
            horaFin: crearFechaConHora(horario.dia, horario.horaFin),       // Combinar fecha con horaFin
            disponible: true
          }))
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Horarios establecidos correctamente');
      } else {
        setError('Error al establecer horarios');
      }

    } catch (err) {
      console.error(err);
      setError('Error en el servidor');
    }
  };

  return (
    <div className="centered-container">
      <div className="form-container">
        <h2>Establecer Horarios Disponibles</h2>
        {error && <p>{error}</p>}

        <form onSubmit={enviarHorarios}>
          <div>
            <label htmlFor="aula">Selecciona un Aula</label>
            <select
              id="aula"
              value={aulaSeleccionada}
              onChange={(e) => setAulaSeleccionada(e.target.value)}
            >
              <option value="">Selecciona un aula</option>
              {aulas.map(aula => (
                <option key={aula._id} value={aula._id}>
                  {aula.nombre} (Bloque: {aula.bloque}, Planta: {aula.planta})
                </option>
              ))}
            </select>
          </div>

          {horarios.map((horario, index) => (
            <div key={index}>
              <label>Día:</label>
              <input
                type="date"
                name="dia"
                value={horario.dia}
                onChange={(e) => handleHorarioChange(index, e)}
                required
              />
              <label>Hora Inicio:</label>
              <input
                type="time"
                name="horaInicio"
                value={horario.horaInicio}
                onChange={(e) => handleHorarioChange(index, e)}
                required
              />
              <label>Hora Fin:</label>
              <input
                type="time"
                name="horaFin"
                value={horario.horaFin}
                onChange={(e) => handleHorarioChange(index, e)}
                required
              />
            </div>
          ))}

          <button type="submit">Establecer Horarios</button>
        </form>
      </div>
    </div>
  );
};
