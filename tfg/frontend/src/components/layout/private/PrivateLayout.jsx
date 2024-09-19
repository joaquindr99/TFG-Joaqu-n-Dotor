import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Header } from './Header';
import useAuth from '../../hooks/useAuth';

export const PrivateLayout = () => {

    const { auth, loading } = useAuth();

    if (loading) {
        return <h1>Cargando...</h1>
    } else {
        return (
            <>

                {/*Cabecera y navegación*/}
                <Header />

                {/*Contenido principal*/}

                <section className="layout__content">
                    {/* Si el usuario está autenticado, muestra las rutas privadas */}
                    {auth.id ? (
                        <Outlet />
                    ) : (
                        // Si no está autenticado, redirige a la página de login
                        <Navigate to="/login" />
                    )}
                </section>
            </>
        )
    }
}
