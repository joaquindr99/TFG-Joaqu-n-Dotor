import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Vacia el localStorage
        localStorage.clear();

        // Setear estados locales a vacío
        setAuth({});

        // Redireccionar al login
        navigate("/login");
    }, [navigate, setAuth]); 

    return (
        <h1>Cerrando sesión...</h1>
    );
};