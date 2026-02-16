import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  useEffect(() => {
    // Inicializar AOS cuando el componente se monta
    if (window.AOS) {
      window.AOS.init();
    }
  }, []);

  return (
    <>
      <main>
        {/* Logo destacado */}
        <section className="py-5 text-center">
          <img src="/assets/VR BAGS.png" alt="VRBAGS" className="mono home-logo"/>
        </section>

        {/* Hero */}
        <section className="hero" data-aos="fade-up">
          <div className="hero-card" data-aos="zoom-in">
            <h1 className="h2">VRBAGS</h1>
            <p className="pimg">Diseños exclusivos, confección artesanal y materiales seleccionados.</p>
            <Link className="btn-cta pimg" to="/catalog">Ver Tienda</Link>
          </div>
        </section>

        {/* Features */}
        <section className="container mb-3 mt-4" data-aos="fade-up">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="feature">
                <h6>Envío a todo el país</h6>
                <p className="text-muted mb-0">Coordinamos por WhatsApp y te mantenemos al tanto hasta la entrega.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature">
                <h6>Cambios y devoluciones</h6>
                <p className="text-muted mb-0">Tenés 30 días para cambios. Te acompañamos en todo el proceso.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature">
                <h6>Atención personalizada</h6>
                <p className="text-muted mb-0">Comprá por WhatsApp y resolvemos tus dudas en el momento.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="container gallery mb-5 mt-3" data-aos="fade-up">
          <h2 className="section-title">Colección</h2>
          <div className="row g-3">
            {/* Miri */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 gallery-item">
              <Link to="/catalog/Miri" className="d-block">
                <img className="w-100 mono gallery-img" src="/assets/Bolso Miri Grande Marron.jpg" alt="Bolso Miri Grande Marrón"/>
              </Link>
            </div>
            {/* Caktus */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 gallery-item">
              <Link to="/catalog/Caktus" className="d-block">
                <img className="w-100 mono gallery-img" src="/assets/Caktus Beige.jpg" alt="Caktus Beige"/>
              </Link>
            </div>
            {/* Golfera */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 gallery-item">
              <Link to="/catalog/Golfera" className="d-block">
                <img className="w-100 mono gallery-img" src="/assets/Golfera Negra.jpg" alt="Golfera Negra"/>
              </Link>
            </div>
            {/* Cata */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 gallery-item hide-mobile">
              <Link to="/catalog/Cata" className="d-block">
                <img className="w-100 mono gallery-img" src="/assets/Cata Negra.jpg" alt="Cata Negra"/>
              </Link>
            </div>
            {/* Mini Chini */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 gallery-item hide-mobile">
              <Link to="/catalog/Mini Chini" className="d-block">
                <img className="w-100 mono gallery-img" src="/assets/Mini Chini Marron Frente.jpg" alt="Mini Chini Marrón"/>
              </Link>
            </div>
            {/* Mochila */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 gallery-item hide-mobile">
              <Link to="/catalog/Mochilas" className="d-block">
                <img className="w-100 mono gallery-img" src="/assets/Mochila Jackie Amarilla.jpg" alt="Mochila Jackie Amarilla"/>
              </Link>
            </div>
            {/* Riñonera */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 gallery-item hide-mobile">
              <Link to="/catalog/Riñoneras" className="d-block">
                <img className="w-100 mono gallery-img" src="/assets/Riñonera 3 cierres Marron Claro.jpg" alt="Riñonera Marrón Claro"/>
              </Link>
            </div>
            {/* Paris */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 gallery-item hide-mobile">
              <Link to="/catalog/Roma" className="d-block">
                <img className="w-100 mono gallery-img" src="/assets/Roma Marron.jpg" alt="Roma Marrón"/>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <div style={{paddingBottom: '1.875rem'}}></div>
    </>
  );
};

export default Home;
