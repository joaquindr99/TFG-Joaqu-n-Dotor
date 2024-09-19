import { React, createContext, useState, useEffect } from 'react';
import {Global} from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authusuario();
    },[]);

    const authusuario = async() => {
        // Sacar datos usuario identificado del localstorage
        const token = localStorage.getItem("token");
        const usuario = localStorage.getItem("usuario");

        // Comprobar si tengo el token y el usuario
        if(!token || !usuario){
            setLoading(false);
            return false;
        }

        // Transformar los datos a un objeto de javascript
        const usuarioObj = JSON.parse(usuario);
        const usuarioId = usuarioObj.id;

        // Peticion ajax al backend que compruebe el token y
        // que me devuelva todos los datos del usuario
        const request = await fetch (Global.url + "usuario/perfil/" + usuarioId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await request.json();

        // Setear el estado de auth
        setAuth(data.usuario);
        setLoading(false);
    }

    return (<AuthContext.Provider
        value={{
            auth,
            setAuth,
            loading
        }}
    >
        {children}
    </AuthContext.Provider>
    )
}


export default AuthContext;