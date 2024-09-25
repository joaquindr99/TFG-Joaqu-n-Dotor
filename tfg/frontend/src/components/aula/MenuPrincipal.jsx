// src/components/aula/ComponenteACargar.jsx
import React from 'react';
import imagen from '../../assets/img/Logo-ETSISI.jpg';

export const MenuPrincipal = () => {

  return (
    <div>
      <h1>Menú Principal</h1>
      <>
        Bienvenido a la aplicación web encargada de gestionar las reservas de aulas de la ETSISI
        Aquí podrás reservar aulas cuando tengan horarios en los que estén disponibles.
      </>
      <img src={imagen} alt="Logo ETSISI" style={{ width: '700px', height: 'auto', marginRight: '10px', marginBottom: '10px' }} />
    </div>
  );
};
