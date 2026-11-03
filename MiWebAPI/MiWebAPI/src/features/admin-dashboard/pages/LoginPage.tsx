import React, { useState } from 'react';
import './LoginPage.css';

export const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        usuario: '',
        password: '',
        recordarme: false,
    });

    // Nuevo estado para controlar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Dentro de tu LoginPage.tsx
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Asegúrate de que la URL apunte al puerto 5299
            const response = await fetch('http://localhost:5299/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: credentials.usuario,
                    password: credentials.password
                })
            });

            // Verificamos si la respuesta HTTP es correcta (status 200-299)
            if (response.ok) {
                const data = await response.json();

                if (data.success) {
                    console.log('Nakalastog:', data.mensaje);
                    window.location.href = '/admin/dashboard';
                } else {
                    alert(data.mensaje || 'Biddut ti usuario wenno password');
                }
            } else {
                // Manejar errores como 401 Unauthorized
                const errorData = await response.json();
                alert(errorData.mensaje || 'Biddut ti usuario wenno password');
            }
        } catch (error) {
            console.error('Adda biddut ti koneksion:', error);
            alert('Saan a maka-konekta iti database. Verifica que la API en C# esté corriendo en el puerto 5299.');
        }
    };

    // Función para alternar el estado del ojito
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="login-container">
            {/* Mitad Izquierda: Branding */}
            <div className="login-brand-section">
                <div className="brand-content">
                    <img
                        src="/logo-tulas-crane-512.png"
                        alt="Logo Tula's Crane"
                        className="login-logo"
                    />
                    <h1 className="login-brand-name">TULA'S CRANE</h1>
                    <p className="login-brand-slogan">Fuerza en cada proyecto</p>
                </div>
            </div>

            {/* Mitad Derecha: Formulario */}
            <div className="login-form-section">
                <div className="login-card">
                    <h2 className="login-title">Bienvenido</h2>
                    <p className="login-subtitle">Accede al panel administrativo</p>

                    <form onSubmit={handleSubmit} className="login-form">

                        {/* Campo Usuario */}
                        <div className="input-wrapper">
                            <i className="bi bi-person input-icon"></i>
                            <input
                                type="text"
                                name="usuario"
                                placeholder="Usuario"
                                value={credentials.usuario}
                                onChange={handleChange}
                                className="login-input"
                                required
                            />
                        </div>

                        {/* Campo Contraseña */}
                        <div className="input-wrapper">
                            <i className="bi bi-lock input-icon"></i>
                            <input
                                // El tipo cambia dinámicamente según el estado
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Contraseña"
                                value={credentials.password}
                                onChange={handleChange}
                                className="login-input"
                                required
                            />
                            <i
                                // El ícono cambia entre ojo normal y ojo tachado
                                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} input-icon-right`}
                                onClick={togglePasswordVisibility}
                                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            ></i>
                        </div>

                        {/* Recordarme */}
                        <div className="checkbox-wrapper">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="recordarme"
                                    checked={credentials.recordarme}
                                    onChange={handleChange}
                                    className="login-checkbox"
                                />
                                Recordarme
                            </label>
                        </div>

                        {/* Botón Submit */}
                        <button type="submit" className="login-submit-btn">
                            Iniciar sesión <i className="bi bi-arrow-right"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};