import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Header } from './Header';
import useAuth from '../../hooks/useAuth';

export const PublicLayout = () => {
    const { auth, loading } = useAuth();

    // Mostrar algo mientras se cargan los datos de auth
    if (loading) {
        return <h1>Cargando...</h1>;
    }

    return (
        <>
            {/*Layout*/}
            <Header />

            {/*Contenido principal*/}

            <section className="layout__content">
                {/* Si está autenticado, redirige a /main, de lo contrario muestra las rutas públicas */}
                {!auth.id ? (
                    <Outlet />
                ) : (
                    <Navigate to="/main" />
                )}
            </section>
        </>
    )
}
