import React, { useEffect } from 'react';
import './Contact.css';

const Contact = () => {
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init();
    }
  }, []);

  return (
    <>
      <main>
        <section className="contact-hero">
          <h1 className="mt-1 h2">CONTACTO</h1>
          <p className="text-light pimg">Escribinos y coordinamos tu compra por WhatsApp o email.</p>
        </section>

        <section className="container my-5">
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-6">
              <div className="contact-card h-100">
                <h5 className="fw-bold mb-3">Formulario</h5>
                <form action="https://formsubmit.co/contact.byuro@gmail.com" method="POST">
                  <div className="mb-3">
                    <label className="form-label">Nombre y apellido</label>
                    <input className="form-control" type="text" name="nombre" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" name="email" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mensaje</label>
                    <textarea className="form-control" name="mensaje" rows="4" required></textarea>
                  </div>
                  <input type="hidden" name="_captcha" value="false" />
                  <button className="btn-black" type="submit">Enviar</button>
                  <input type="hidden" name="_next" value="https://www.vrbags.store" />
                  <input type="hidden" name="_captcha" value="false" />
                </form>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="contact-card h-100">
                <h5 className="fw-bold mb-3">También podés</h5>
                <p className="mb-2">
                  WhatsApp: <a className="link-plain" href="https://wa.me/5491168666761" target="_blank" rel="noopener noreferrer">+54 9 11 6866 6761</a>
                </p>
                <img src="/assets/VR BAGS.png" alt="VRBAGS" className="w-100 rounded-4 mono mt-3 contact-image"/>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div style={{paddingBottom: '30px'}}></div>
    </>
  );
};

export default Contact;
