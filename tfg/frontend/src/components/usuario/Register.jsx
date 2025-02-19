import React from 'react'
import { useForm } from '../hooks/useForm';
import { Global } from '../../helpers/Global';
import { useState } from 'react';

export const Register = () => {

  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const saveusuario = async (e) => {
    // Prevenir actualización de pantalla
    e.preventDefault();

    // Recoger datos del formulario
    let newusuario = form;

    // Guardar usuario en el backend
    const request = await fetch(Global.url + "usuario/registro", {
      method: "POST",
      body: JSON.stringify(newusuario),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await request.json();

    if (data.status == "success") {
      setSaved("saved");
    } else {
      setSaved("error");
    }

  } // Fin del metodo de guardar

  return (
    <>
      <header className='content_header content__header--public'>
        <h1 className='content__title'>Registro</h1>
      </header>

      <div className='form-container'>
        <div className='content__posts'>
          {saved == "saved" ?
            <strong className='alert alert-success'> "Usuario registrado correctamente!" : '' </strong>
            : ''}

          {saved == "error" ?
            <strong className='alert alert-danger'>Usuario no se ha registrado!</strong>
            : ''}

          <form className='register-form' onSubmit={saveusuario}>

            <div className='form-group'>
              <label htmlFor='name'>Nombre</label>
              <input type="text" name="name" onChange={changed} />
            </div>

            <div className='form-group'>
              <label htmlFor='surname'>Apellidos</label>
              <input type="text" name="surname" onChange={changed} />
            </div>

            <div className='form-group'>
              <label htmlFor='email'>Correo Electrónico</label>
              <input type="email" name="email" onChange={changed} />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Contraseña</label>
              <input type="password" name="password" onChange={changed} />
            </div>

            <input type="submit" value="Registrate" className='btn btn-success' />

          </form>

        </div>
      </div>
    </>
  )
}
