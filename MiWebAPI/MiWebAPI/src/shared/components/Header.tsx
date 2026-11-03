import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const Header = () => {
    return (
        <header className="app-header">
            <div className="app-header-container">

                {/* LOGO SIN TEXTO (Acceso oculto al login) */}
                <Link to="/login" className="tc-brand" aria-label="Acceso privado administradores">
                    <img src="/logo-tulas-crane-192.png" alt="Tula's Crane Logo" className="brand-icon" />
                </Link>

                {/* NAVEGACIÓN PRINCIPAL FIJA */}
                <nav className="main-nav">
                    <NavLink to="/" className="nav-item" end>
                        <i className="bi bi-house-door-fill"></i>
                        <span>Inicio</span>
                    </NavLink>

                    <NavLink to="/maquinaria" className="nav-item">
                        <i className="bi bi-truck-front"></i>
                        <span>Maquinaria</span>
                    </NavLink>

                    <NavLink to="/servicios" className="nav-item">
                        <i className="bi bi-gear"></i>
                        <span>Servicios</span>
                    </NavLink>

                    <NavLink to="/contacto" className="nav-item">
                        <i className="bi bi-telephone"></i>
                        <span>Contacto</span>
                    </NavLink>
                </nav>

            </div>
        </header>
    );
};