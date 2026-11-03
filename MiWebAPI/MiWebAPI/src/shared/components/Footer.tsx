import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="tc-footer">
            <div className="tc-footer-container">

                {/* Identidad de la empresa */}
                <div className="tc-footer-brand">
                    <Link to="/" aria-label="Ir al inicio">
                        <img src="C:\Users\adona\OneDrive\Documents\proyecto_pwa\MiWebAPI\MiWebAPI\public\Copia de Tula's Crane Logo.png" alt="Logo de Tula's Crane" className="tc-footer-logo" />
                    </Link>
                    <p className="tc-footer-slogan">Soluciones que mueven grandes proyectos.</p>
                </div>

                {/* Enlaces rápidos */}
                <div className="tc-footer-links">
                    <h2>Enlaces rápidos</h2>
                    <Link to="/">Inicio</Link>
                    <Link to="/maquinaria">Maquinaria</Link>
                    <Link to="/servicios">Servicios</Link>
                    <Link to="/contacto">Contacto</Link>
                    <Link to="/cotizacion">Cotizaciones</Link>
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
                <p>© {currentYear} Tula's Crane. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};