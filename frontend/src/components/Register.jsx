import React, { useState } from 'react';
import '../components/css/auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataWithFile = new FormData();
        formDataWithFile.append('firstName', formData.firstName);
        formDataWithFile.append('lastName', formData.lastName);
        formDataWithFile.append('email', formData.email);
        formDataWithFile.append('password', formData.password);
        if (profilePicture) {
            formDataWithFile.append('profilePicture', profilePicture);
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                body: formDataWithFile,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error desconocido.');
            }

            setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
        } catch (error) {
            console.error('Error en el registro:', error);
            setMessage('El registro falló. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="container">
            <div className="auth-container">
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Apellido</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Foto de Perfil</label>
                        <input type="file" name="profilePicture" onChange={handleFileChange} accept="image/*" />
                    </div>
                    <button type="submit">Registrarse</button>
                </form>
                {message && <p className={message.includes('exitoso') ? 'success-message' : 'error-message'}>{message}</p>}
            </div>
        </div>
    );
};

export default Register;
