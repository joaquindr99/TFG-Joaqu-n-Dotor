import React from 'react'
import { useForm } from '../hooks/useForm'
import { useState } from 'react';
import { Global } from '../../helpers/Global';
import useAuth from '../hooks/useAuth';

export const Login = () => {

  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const { setAuth } = useAuth();

  const loginusuario = async (e) => {
    e.preventDefault();

    // Datos del formulario
    let usuarioToLogin = form;

    // Petición al backend
    const request = await fetch(Global.url + 'usuario/login', {
      method: "POST",
      body: JSON.stringify(usuarioToLogin),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await request.json();

    if (data.status === "success") {

      // Mostrar el mensaje de éxito por un segundo
      setSaved("login");

      // Persistir los datos en el navegador
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Esperar un segundo antes de cambiar el estado de autenticación
      setTimeout(() => {
        // Setear los datos de autenticación
        setAuth(data.usuario);
      }, 1000);

    } else {
      setSaved("error");
    }

  }

  return (
    <>
      <header className='content_header content__header--public'>
        <h1 className='content__title'>Login</h1>
      </header>

      <div className='form-container'>
        <div className='content__posts'>

          {saved == "login" ?
            <strong className='alert alert-success'> "Usuario identificado correctamente!" : '' </strong>
            : ''}

          {saved == "error" ?
            <strong className='alert alert-danger'>Usuario no se ha identificado!</strong>
            : ''}

          <form className='form-login' onSubmit={loginusuario}>

            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type="email" name="email" onChange={changed} />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Contraseña</label>
              <input type="password" name="password" onChange={changed} />
            </div>

            <input type="submit" value="Identificate" className="btn btn-success" />

          </form>

        </div>
      </div>
    </>
  )
}
