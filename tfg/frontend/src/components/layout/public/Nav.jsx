import React from 'react'
import { NavLink } from 'react-router-dom'

export const Nav = () => {
    return (
        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <NavLink to="/login" className="menu-list__link">
                        <i className="fa-solid fa-usuario"></i>
                        <span className="menu-list__title">Login</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="/registro" className="menu-list__link">
                        <i className="fa-solid fa-usuarios"></i>
                        <span className="menu-list__title">Registro</span>
                    </NavLink>
                </li>

            </ul>

        </nav>
    )
}
