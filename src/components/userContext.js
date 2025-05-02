import React, {createContext, useContext, useEffect, useState} from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userInfo, token) => {
        setUser({ ...userInfo, token });
        sessionStorage.setItem('tokenValue', token);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('tokenValue');
        sessionStorage.removeItem('userInfo')
        window.location.href = '/login'
    };

    const update = (userInfo) => {
        setUser(userInfo)
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    }

    useEffect(() => {
        const token = sessionStorage.getItem('tokenValue');
        const userInfoString = sessionStorage.getItem('userInfo');

        if (token && userInfoString) {
            try {
                const userInfo = JSON.parse(userInfoString);
                setUser({ ...userInfo, token });
            } catch {
                logout();
            }
        }

        setLoading(false);
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout, update, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);