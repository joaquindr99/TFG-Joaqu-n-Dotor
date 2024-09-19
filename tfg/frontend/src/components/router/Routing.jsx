import React from 'react'
import { Routes, Route, BrowserRouter, Navigate, Link } from 'react-router-dom';
import { PublicLayout } from '../layout/public/PublicLayout';
import { Register } from '../usuario/Register';
import { Login } from '../usuario/Login';
import { Logout } from '../usuario/Logout';
import { PrivateLayout } from '../layout/private/PrivateLayout';
import { MenuPrincipal } from '../aula/MenuPrincipal';
import { AuthProvider } from '../../context/AuthProvider';
import { Aulas } from '../aula/Aulas';
import { Reservas } from '../reserva/Reservas';
import { AgregarAulas } from '../aula/AgregarAulas';
import { AgregarHorarios } from '../aula/AgregarHorarios'; 

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Register />} />
          </Route>

          <Route path="/main" element={<PrivateLayout />}>
            <Route index element={<MenuPrincipal />} />
            <Route path="menuprincipal" element={<MenuPrincipal />} />
            <Route path="logout" element={<Logout />} />
            <Route path="aulas" element={<Aulas />} />
            <Route path="reservas" element={<Reservas />} />
            <Route path="agregar-aulas" element={<AgregarAulas />} />
            <Route path="agregar-horarios" element={<AgregarHorarios />} />
          </Route>

          <Route path="*" element={
            <>
              <p>
                <h1>Error 404</h1>
                <Link to="/">Volver al inicio</Link>
              </p>
            </>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
