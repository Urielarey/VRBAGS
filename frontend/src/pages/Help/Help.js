import React, { useEffect } from 'react';
import './Help.css';

const Help = () => {
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init();
    }
  }, []);

  return (
    <>
      <main>
        <section className="help-hero">
          <h1 className="mt-1 h2">AYUDA</h1>
          <p className="text-light pimg">Preguntas frecuentes y políticas. Escríbanos si necesitás algo más.</p>
        </section>
        <section className="faq container my-5" data-aos="fade-up">
          <article>
            <h4 className="h4 text-center mb-4">Preguntas Frecuentes</h4>
          </article>
          <article className="preguntas">
            <div className="d-flex justify-content-center">
              <div className="accordion w-100 w-md-75" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      ¿De qué material son las carteras?
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      Todas nuestras carteras están confeccionadas en cuero vacuno legítimo, seleccionado por su calidad, resistencia y durabilidad. Cada pieza es única y artesanal.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      ¿Hacen envíos a todo el país?
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      Sí, realizamos envíos a todo el territorio argentino. Coordinamos el envío por WhatsApp luego de tu compra para que elijas la opción más conveniente.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      ¿Cómo consulto el precio y el stock?
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      Los precios pueden variar según el modelo y la disponibilidad. Te recomendamos consultar el precio y el stock actual por WhatsApp antes de realizar la compra, ya que el stock y los colores cambian según la demanda y lo más vendido.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                      ¿Puedo elegir el color de la cartera?
                    </button>
                  </h2>
                  <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      Sí, ofrecemos varios colores según el modelo. Sin embargo, la disponibilidad de colores varía constantemente. Consultá por WhatsApp para ver los colores disponibles en el momento.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                      ¿Cómo realizo una compra?
                    </button>
                  </h2>
                  <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      Agregá los productos al carrito y hacé clic en "Proceder al Pago". Se abrirá un formulario para que completes tus datos y luego se generará un mensaje de WhatsApp para coordinar el pago y el envío de forma personalizada.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                      ¿Qué formas de pago aceptan?
                    </button>
                  </h2>
                  <div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      Aceptamos transferencia bancaria, Mercado Pago y efectivo (en caso de retiro o entrega en persona). Consultá por otras opciones si lo necesitás.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                      ¿Cómo cuido mi cartera de cuero?
                    </button>
                  </h2>
                  <div id="collapseSeven" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      Recomendamos limpiar el cuero con un paño suave y apenas húmedo. Evitá exponer la cartera al sol directo o a fuentes de calor. Guardala en un lugar ventilado y, si es posible, dentro de una funda de tela. No uses productos abrasivos ni la laves en lavarropas.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
                      ¿Puedo cambiar o devolver mi compra?
                    </button>
                  </h2>
                  <div id="collapseEight" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      Sí, podés realizar cambios dentro de los 15 días de recibida la cartera, siempre que esté en perfectas condiciones y sin uso. Las devoluciones solo se aceptan si el producto presenta una falla de fábrica. Para gestionar cambios o devoluciones, escribinos por WhatsApp.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
        <section>
          <article>
            <h4 className="h4" data-aos="fade-up">CUIDADO DEL CUERO</h4>
          </article>
          <article className="cuidado">
            <div className="contenedorp" data-aos="fade-up">
              <p className="cuidadop">
                Para que tu cartera de cuero vacuno conserve su belleza y durabilidad:
              </p>
            </div>
            <ul data-aos="fade-up">
              <li>- Limpiá con un paño suave y apenas húmedo.</li>
              <li>- No uses productos abrasivos ni detergentes.</li>
              <li>- Evitá el contacto prolongado con el sol y fuentes de calor.</li>
              <li>- Guardá en un lugar ventilado, preferentemente en funda de tela.</li>
              <li>- No laves en lavarropas ni sumerjas en agua.</li>
            </ul>
          </article>
        </section>
      </main>
      <div style={{paddingBottom: '30px'}}></div>
    </>
  );
};

export default Help;
