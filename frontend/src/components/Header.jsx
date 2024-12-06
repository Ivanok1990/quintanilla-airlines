import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/css/Header.css';

const Header = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;

            try {
                const response = await axios.get(
                    'http://localhost:8080/api/auth/profile/me',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setUser(response.data);
            } catch (error) {
                console.error('Error obteniendo datos del usuario:', error);
                setUser(null);
            }
        };

        fetchUser();
    }, [token]);

    const handleLogout = async () => {
        try {
            await axios.post(
                'http://localhost:8080/api/auth/logout',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error cerrando sesión:', error);
        }
    };

    const handleProfileAccess = () => {
        if (user) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">
                    <img
                        src="http://localhost:8080/imagenes/logo2.jpg"
                        alt="Quintanilla Airline Logo"
                    />
                </Link>
            </div>
            <nav className="nav">
                <ul>
                    <li>
                        <Link to="/search-reservation" className="reservation-btn">
                            <i className="fas fa-search"></i> Reservaciones
                        </Link>
                    </li>
                    {user ? (
                        <>
                            {user.isadmin && (
                                <li>
                                    <Link to="/admin" className="admin-btn">
                                        <i className="fas fa-user-shield"></i> Admin
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button
                                    onClick={handleProfileAccess}
                                    className="profile-btn"
                                >
                                    <i className="fas fa-user-circle"></i> Profile
                                </button>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="login-btn">
                                    <i className="fas fa-sign-in-alt"></i> Log in
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="register-btn">
                                    <i className="fas fa-user-plus"></i> Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
