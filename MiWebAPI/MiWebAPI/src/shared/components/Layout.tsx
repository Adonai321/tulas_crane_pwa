import React, { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import './Layout.css'; // Aquí pegas tu archivo CSS original completo

export const Layout: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const currentYear = new Date().getFullYear();

    return (
        <div className="tc-layout-wrapper">

            {/* HEADER EXACTO CON TUS CLASES ORIGINALES */}
            <header className="tc-header">
                <div className="tc-header-container">

                    {/* Marca: logo, nombre y eslogan (Apunta al login de admin) */}
                    <Link
                        to="/login"
                        className="tc-brand"
                        aria-label="Acceso de Tula's Crane"
                        title="Tula's Crane"
                        onClick={closeMenu}
                    >
                        <img
                            src="/logo-tulas-crane-192.png"
                            alt="Logo de Tula's Crane"
                            className="tc-logo"
                        />
                        <div className="tc-brand-text">
                            <span className="tc-brand-name">TULA'S CRANE</span>
                            <span className="tc-brand-slogan">Soluciones que mueven grandes proyectos.</span>
                        </div>
                    </Link>

                    {/* Botón de hamburguesa para celulares */}
                    <button
                        className={`tc-menu-toggle ${isMenuOpen ? 'tc-menu-active' : ''}`}
                        id="tcMenuToggle"
                        type="button"
                        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={isMenuOpen}
                        aria-controls="tcNavigation"
                        onClick={toggleMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    {/* Navegación principal */}
                    <nav
                        className={`tc-navigation ${isMenuOpen ? 'tc-menu-open' : ''}`}
                        id="tcNavigation"
                        aria-label="Navegación principal"
                    >
                        <NavLink to="/" className="tc-nav-link" onClick={closeMenu} end>
                            <i className="bi bi-house-fill" aria-hidden="true"></i>
                            <span>Inicio</span>
                        </NavLink>

                        <NavLink to="/maquinaria" className="tc-nav-link" onClick={closeMenu}>
                            <i className="bi bi-truck-front" aria-hidden="true"></i>
                            <span>Maquinaria</span>
                        </NavLink>

                        <NavLink to="/servicios" className="tc-nav-link" onClick={closeMenu}>
                            <i className="bi bi-gear" aria-hidden="true"></i>
                            <span>Servicios</span>
                        </NavLink>

                        <NavLink to="/contacto" className="tc-nav-link" onClick={closeMenu}>
                            <i className="bi bi-telephone" aria-hidden="true"></i>
                            <span>Contacto</span>
                        </NavLink>

                        <NavLink to="/cotizacion" className="tc-nav-link tc-nav-quote" onClick={closeMenu}>
                            <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
                            <span>Solicitar cotización</span>
                        </NavLink>
                    </nav>

                </div>
            </header>

            {/* CONTENIDO DINÁMICO (Aquí se renderiza tu Landing Page) */}
            <main className="tc-main-content">
                <Outlet />
            </main>

            {/* FOOTER EXACTO CON TUS CLASES ORIGINALES */}
            <footer className="tc-footer">
                <div className="tc-footer-container">

                    {/* Identidad de la empresa */}
                    <div className="tc-footer-brand">
                        <Link to="/" aria-label="Ir al inicio">
                            <img
                                src="/logo-tulas-crane-192.png"
                                alt="Logo de Tula's Crane"
                                className="tc-footer-logo"
                            />
                        </Link>
                        <p className="tc-footer-slogan">
                            Soluciones que mueven grandes proyectos.
                        </p>
                    </div>

                    {/* Enlaces rápidos */}
                    <div className="tc-footer-links">
                        <h2>Enlaces rápidos</h2>
                        <NavLink to="/">Inicio</NavLink>
                        <NavLink to="/maquinaria">Maquinaria</NavLink>
                        <NavLink to="/servicios">Servicios</NavLink>
                        <NavLink to="/contacto">Contacto</NavLink>
                        <NavLink to="/cotizacion">Cotizaciones</NavLink>
                    </div>

                    {/* Contacto */}
                    <div className="tc-footer-contact">
                        <h2>¿Tienes un proyecto en mente?</h2>
                        <p>
                            Estamos listos para conocer tus necesidades y ayudarte a encontrar la solución adecuada para tu proyecto.
                        </p>
                        <Link to="/contacto" className="tc-footer-contact-link">
                            Contáctanos <i className="bi bi-arrow-right" aria-hidden="true"></i>
                        </Link>
                    </div>

                </div>

                {/* Derechos reservados */}
                <div className="tc-footer-bottom">
                    <p>
                        &copy; <span id="tcCurrentYear">{currentYear}</span> Tula's Crane. Todos los derechos reservados.
                    </p>
                </div>
            </footer>

        </div>
    );
};