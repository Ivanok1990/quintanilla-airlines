import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/css/profile.css';
import Chat from '../components/Chat'; // Importa el componente Chat

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/auth/profile/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        console.log('No autenticado. Redirigiendo a /login...');
                        navigate('/login');
                    } else {
                        throw new Error('Error al cargar el perfil. Intenta nuevamente.');
                    }
                }

                const data = await response.json();
                console.log('Datos del perfil obtenidos:', data);
                setUser(data);
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
                setError(error.message);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Sesión cerrada exitosamente');
                window.location.href = '/';
            } else {
                throw new Error('Error al cerrar sesión.');
            }
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
        }
    };

    if (!user) {
        return <div className="container"><p>Cargando perfil...</p></div>;
    }

    return (
        <div className="container">
            <div className="auth-container">
                <h2>Perfil</h2>
                {user.profilePicture && (
                    <img
                        src={`http://localhost:8080/imagenes/perfiles/${user.profilePicture}`}
                        alt="Foto de perfil"
                        className="profile-picture"
                    />
                )}
                <div className="profile-info">
                    <h3>Información del Usuario</h3>
                    <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    Cerrar sesión
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>

            {/* Agregar el componente de Chat y pasar la información del usuario */}
            <div className="chat-section">
                <h3>if you have a problem send a message to admin</h3>
                <Chat user={user} />
            </div>
        </div>
    );
};

export default Profile;
