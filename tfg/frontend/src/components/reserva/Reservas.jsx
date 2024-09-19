import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';

export const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener las reservas del usuario autenticado
  const obtenerReservas = async () => {
    try {
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const usuarioId = usuario.id;
      const esAdminOProfesor = usuario.role === 'admin' || usuario.role === 'profesor';
      
      const url = esAdminOProfesor
      ? Global.url + 'reserva/listar-reservas'  // Obtener todas las reservas
      : Global.url + `reserva/mis-reservas/${usuarioId}`;  // Obtener solo las reservas del usuario

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        setReservas(data.reservas);
      } else {
        setError('Error al obtener las reservas');
      }
    } catch (err) {
      console.error(err);
      setError('Error en el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar una reserva
  const cancelarReserva = async (reservaId, aulaId, horario) => {
    try {
      const token = localStorage.getItem('token');

      // Llamada para cancelar la reserva
      const response = await fetch(Global.url + 'reserva/cancelar-reserva', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ reservaId })
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Actualizar el aula para que el horario esté disponible
        await fetch(Global.url + 'aula/actualizar-horarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            aulaId: aulaId,
            horariosDisponibles: [{
              dia: horario.dia,
              horaInicio: horario.hora_ini,
              horaFin: horario.hora_fin,
              disponible: true
            }]
          })
        });

        // Eliminar la reserva del estado local
        setReservas(reservas.filter(reserva => reserva._id !== reservaId));
      } else {
        setError('Error al cancelar la reserva');
      }
    } catch (err) {
      console.error(err);
      setError('Error en el servidor');
    }
  };

  useEffect(() => {
    obtenerReservas();
  }, []);

  if (loading) return <div>Cargando reservas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Reservas</h2>
      {reservas.length === 0 ? (
        <p>No tienes reservas actuales.</p>
      ) : (
        <ul>
          {reservas.map(reserva => (
            <li key={reserva._id} className="reserva-item">
              <h3>Aula: {reserva.aula.nombre}</h3>
              <p>Bloque: {reserva.aula.bloque}, Planta: {reserva.aula.planta}</p>
              <p>Día: {new Date(reserva.dia).toLocaleDateString()}</p>
              <p>Hora Inicio: {new Date(reserva.hora_ini).toLocaleTimeString()}</p>
              <p>Hora Fin: {new Date(reserva.hora_fin).toLocaleTimeString()}</p>
              <p>Duración: {reserva.duracion} minutos</p>

              <p><strong>Reservado por:</strong> {reserva.usuario.name} {reserva.usuario.surname}</p>

              <button onClick={() => cancelarReserva(reserva._id, reserva.aula._id, {
                dia: reserva.dia,
                hora_ini: reserva.hora_ini,
                hora_fin: reserva.hora_fin
              })}>Cancelar Reserva</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
