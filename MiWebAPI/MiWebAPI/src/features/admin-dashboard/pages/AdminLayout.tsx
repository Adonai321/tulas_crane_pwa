import React, { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import './AdminLayout.css';

export const AdminLayout = () => {
    // Estado para controlar el menú hamburguesa en móviles
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="admin-layout-wrapper">

            {/* HEADER ADMINISTRATIVO */}
            <header className="admin-header">
                <Link to="/admin/dashboard" className="admin-brand" onClick={closeMenu}>
                    <img src="/logo-tulas-crane-192.png" alt="Tula's Crane" />
                    <span>TULA'S CRANE</span>
                </Link>

                {/* NAVEGACIÓN ADMINISTRATIVA */}
                <nav className={`admin-nav ${isMenuOpen ? 'open' : ''}`}>
                    <NavLink to="/admin/dashboard" className="admin-nav-link" onClick={closeMenu} end>
                        <i className="bi bi-house-fill"></i>
                        <span>Inicio</span>
                    </NavLink>

                    <NavLink to="/admin/maquinaria" className="admin-nav-link" onClick={closeMenu}>
                        <i className="bi bi-truck-front"></i>
                        <span>Maquinaria</span>
                    </NavLink>

                    <NavLink to="/admin/empleados" className="admin-nav-link" onClick={closeMenu}>
                        <i className="bi bi-person-vcard"></i>
                        <span>Empleados</span>
                    </NavLink>

                    <NavLink to="/admin/calendario" className="admin-nav-link" onClick={closeMenu}>
                        <i className="bi bi-calendar-event"></i>
                        <span>Calendario</span>
                    </NavLink>

                    <NavLink to="/admin/finanzas" className="admin-nav-link" onClick={closeMenu}>
                        <i className="bi bi-cash-coin"></i>
                        <span>Finanzas</span>
                    </NavLink>
                </nav>

                {/* BOTÓN HAMBURGUESA (Móviles) */}
                <button
                    type="button"
                    className="admin-menu-toggle"
                    onClick={toggleMenu}
                    aria-label="Menú"
                >
                    <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
                </button>
            </header>

            {/* CONTENIDO CENTRAL */}
            <main className="admin-main-content">
                {/* Aquí se renderizarán las páginas hijas como DashboardPage */}
                <Outlet />
            </main>

        </div>
    );
};