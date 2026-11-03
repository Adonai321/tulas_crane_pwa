import React from 'react';
import './LandingPage.css';

export const LandingPage = () => {
    return (
        <div className="landing-wrapper">

            {/* PANEL IZQUIERDO (PORTADA) */}
            <section className="hero-panel">
                <div className="hero-content">
                    <h1 className="hero-title">
                        MAQUINARIA<br />
                        PARA TUS<br />
                        PROYECTOS
                    </h1>
                    <p className="hero-subtitle">
                        Renta de maquinaria pesada<br />
                        y maniobras especializadas.
                    </p>

                    <div className="hero-actions">
                        <button className="tc-btn tc-btn-primary" onClick={() => window.location.href = '/maquinaria'}>
                            Ver maquinaria <i className="bi bi-arrow-right"></i>
                        </button>
                        <button className="tc-btn tc-btn-outline" onClick={() => window.location.href = '/cotizacion'}>
                            Solicitar cotización <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </section>

            {/* PANEL DERECHO (TARJETAS Y NOSOTROS) */}
            <section className="right-panel">

                {/* Accesos Rápidos */}
                <div className="features-grid">
                    <div className="feature-card">
                        <i className="bi bi-calendar2-check feature-icon"></i>
                        <span>Tipos de<br />renta</span>
                    </div>
                    <div className="feature-card">
                        <i className="bi bi-cone-striped feature-icon"></i>
                        <span>Maniobras<br />especiales</span>
                    </div>
                    <div className="feature-card">
                        <i className="bi bi-building feature-icon"></i>
                        <span>Sectores de<br />trabajo</span>
                    </div>
                </div>

                {/* Sección Nosotros */}
                <div className="about-card">
                    <h2 className="about-title-main">NOSOTROS</h2>

                    {/* Experiencia (Fondo Arena) */}
                    <div className="about-content">
                        <span className="section-eyebrow">NUESTRA TRAYECTORIA</span>
                        <h3 className="about-heading">EXPERIENCIA QUE IMPULSA TUS PROYECTOS</h3>
                        <p className="about-text">
                            Brindando servicios de renta de maquinaria pesada y maniobras especializadas desde 2009, trabajamos con un compromiso constante con la seguridad, la eficiencia y la calidad.
                        </p>

                        <div className="about-certifications">
                            <div className="cert-item">
                                <i className="bi bi-person-badge"></i>
                                <div>
                                    <h4>OPERADORES CERTIFICADOS</h4>
                                    <p>Personal capacitado para realizar maniobras de manera segura y eficiente.</p>
                                </div>
                            </div>
                            <div className="cert-item">
                                <i className="bi bi-check-circle"></i>
                                <div>
                                    <h4>MAQUINARIA CERTIFICADA</h4>
                                    <p>Equipos destinados a atender los requerimientos de cada proyecto.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Misión, Visión y Valores (Cajas Crema) */}
                    <div className="about-boxes">
                        <div className="info-box">
                            <div className="info-icon"><i className="bi bi-bullseye"></i></div>
                            <h6>MISIÓN</h6>
                            <p>Brindar servicios de renta de maquinaria pesada y operadores altamente calificados, ofreciendo soluciones eficientes, seguras y de calidad.</p>
                        </div>
                        <div className="info-box">
                            <div className="info-icon"><i className="bi bi-eye"></i></div>
                            <h6>VISIÓN</h6>
                            <p>Ser una empresa hidalguense reconocida a nivel nacional por la calidad de nuestros servicios y la confianza de nuestros clientes.</p>
                        </div>
                        <div className="info-box">
                            <div className="info-icon"><i className="bi bi-gem"></i></div>
                            <h6>VALORES</h6>
                            <ul>
                                <li>Respeto</li>
                                <li>Responsabilidad</li>
                                <li>Cordialidad</li>
                                <li>Competitividad</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};
