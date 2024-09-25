import React, { useState, useEffect } from 'react';
import { Global } from '../../helpers/Global';
import useAuth from '../hooks/useAuth';

export const Aulas = () => {
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth(); // Innecesario???
  
    useEffect(() => {
      obtenerAulas();
    }, []);
  
    const obtenerAulas = async () => {
      try {
        const request = await fetch(Global.url + 'aula/listar-aulas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await request.json();
        if (data.status === 'success') {
          setAulas(data.aulas);
        } else {
          console.error('Error al obtener aulas');
        }
      } catch (error) {
        console.error('Error en la petición:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const reservarHorario = async (aula, horario) => {
      const duracion = (new Date(horario.horaFin) - new Date(horario.horaInicio)) / (1000 * 60);
      try {
        const request = await fetch(Global.url + 'reserva/crear-reserva', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token"),
          },
          body: JSON.stringify({
            aulaId: aula._id,
            dia: horario.dia,
            hora_ini: horario.horaInicio,
            hora_fin: horario.horaFin,
            duracion: duracion,
          })
        });
  
        const data = await request.json();
        if (data.status === 'success') {
          // Actualizar el estado de los horarios del aula
          setAulas(prevAulas => 
            prevAulas.map(a => 
              a._id === aula._id 
              ? { ...a, horariosDisponibles: a.horariosDisponibles.map(h => 
                h._id === horario._id ? { ...h, disponible: false } : h) }
              : a
            )
          );
          alert("Reserva creada con éxito.");
        } else {
          alert(data.message || 'Error al realizar la reserva.');
        }
      } catch (error) {
        console.error('Error en la reserva:', error);
      }
    };
  
    if (loading) {
      return <div>Cargando aulas...</div>;
    }
  
    return (
      <div className="aulas-page">
        <h1>Lista de Aulas</h1>
        <div className="aulas-container">
          {aulas.length > 0 ? (
            aulas.map((aula) => (
              <div key={aula._id} className="aula-card">
                <h2 className="aula-title">{aula.nombre}</h2>
                <div className="aula-info">
                  <p><strong>Capacidad:</strong> {aula.capacidad}</p>
                  <p><strong>Bloque:</strong> {aula.bloque}</p>
                  <p><strong>Planta:</strong> {aula.planta}</p>
                  <p><strong>Descripción:</strong> {aula.descripcion}</p>
                </div>

                <div className="divider"></div>
                
                <h3>Horarios Ofertados:</h3>
                <div className="horarios-container">
                  {aula.horariosDisponibles.length > 0 ? (
                    aula.horariosDisponibles.map((horario, index) => (
                      <div
                        key={index}
                        className={`horario ${horario.disponible ? 'disponible' : 'no-disponible'}`}
                        onClick={() => {
                          if (horario.disponible) {
                            reservarHorario(aula, horario); // Llamamos a la función de reserva al hacer clic
                          }
                        }}
                      >
                        <p><strong>Día:</strong> {new Date(horario.dia).toLocaleDateString()}</p>
                        <p><strong>Hora Inicio:</strong> {new Date(horario.horaInicio).toLocaleTimeString()}</p>
                        <p><strong>Hora Fin:</strong> {new Date(horario.horaFin).toLocaleTimeString()}</p>
                        <p><strong>Estado:</strong> {horario.disponible ? 'Disponible' : 'No Disponible'}</p>
                      </div>
                    ))
                  ) : (
                    <p>No hay horarios disponibles para esta aula.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No hay aulas disponibles en este momento.</p>
          )}
        </div>
      </div>
    );
  };