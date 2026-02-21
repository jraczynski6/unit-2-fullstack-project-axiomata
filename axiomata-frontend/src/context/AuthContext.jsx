import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);

    // update Local storage when token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // login
    const login = (newToken) => {
        setToken(null);
    };

    // Logout
    const logout = () => {
        setToken(null);
    };

    // derived state
    const isAuthenticated = !!token;

    // value
    const value = {token, login, logout, isAuthenticated};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

//hook to consume context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error ("useAuth must be used within an AuthProvider");
    }
    return context;
}