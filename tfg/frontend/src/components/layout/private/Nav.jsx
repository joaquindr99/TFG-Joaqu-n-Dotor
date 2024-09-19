import React from 'react'
import { NavLink } from 'react-router-dom'

export const Nav = () => {

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const role = usuario.role;

    return (
        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <NavLink to="/main" className="menu-list__link">
                        <i className="fa-solid fa-house"></i>
                        <span className="menu-list__title">Inicio</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="/main/aulas" className="menu-list__link">
                        <i className="fa-solid fa-briefcase"></i>
                        <span className="menu-list__title">Aulas</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="/main/reservas" className="menu-list__link">
                        <i className="fa-solid fa-calendar-days"></i>
                        <span className="menu-list__title">Reservas</span>
                    </NavLink>
                </li>

                {(role === 'admin' || role === 'profesor') && ( // Si el usuario es profesor o admin aparecen estos botones
                    <>
                        <li className="menu-list_item">
                            <NavLink to="/main/agregar-aulas" className="menu-list__link">
                            <i className="fa-solid fa-pen-to-square"></i>
                            <span className="menu-list__title">Agregar Aulas</span>
                            </NavLink>
                        </li><li className="menu-list_item">
                            <NavLink to="/main/agregar-horarios" className="menu-list__link">
                            <i className="fa-solid fa-business-time"></i>
                            <span className="menu-list__title">Agregar Horarios</span>
                            </NavLink>
                        </li>
                    </>
                )}

            </ul>

            <ul className="container-lists__list-end">
                <li className="list-end__item">
                    <NavLink to="/main/logout" className="list-end__link">
                        <i className='fa-solid fa-arrow-right-from-bracket'></i>
                        <span className="list-end__name">Cerrar sesión</span>
                    </NavLink>
                </li>
            </ul>

        </nav>
    )
}
