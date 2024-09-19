import React from 'react';
import { Nav } from './Nav';
import logo from '../../../assets/img/LogoETSISI.png';

export const Header = () => {

    return (
        <header className="layout__navbar">

            <div>
                <img src={logo} alt="Logo ETSISI" style={{ width: 'auto', height: '40px', marginBottom: '10px', marginLeft: '10px' }} />
            </div>

            <Nav />

        </header>
    );
};
