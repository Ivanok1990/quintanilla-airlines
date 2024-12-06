import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/css/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita el comportamiento predeterminado del formulario.
        try {
            // Realiza la solicitud de login al servidor.
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Configura el encabezado para JSON.
                },
                credentials: 'include', // Incluye cookies en la solicitud.
                body: JSON.stringify({ email, password }), // Cuerpo de la solicitud en formato JSON.
            });

            // Verifica si la respuesta es exitosa.
            if (!response.ok) {
                // Obtén el mensaje de error del servidor.
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error desconocido.');
            }

            // Procesa los datos devueltos por el servidor.
            const data = await response.json();
            const { user } = data;

            console.log('Usuario autenticado:', user);

            // Redirige al usuario según su rol.
            navigate(user.isadmin ? '/admin' : '/profile');
        } catch (err) {
            // Maneja los errores y muestra el mensaje al usuario.
            console.error('Error en el inicio de sesión:', err.message);
            setErrorMessage(err.message); // Actualiza el estado con el mensaje de error.
        }
    };


    return (
        <div className="container">
            <div className="auth-container">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Iniciar Sesión</button>
                </form>
                {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                )}
                <div className="forgot-password">
                    <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
