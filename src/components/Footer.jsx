import './Footer.css';
import { FaFacebookF, FaInstagram, FaSpotify } from 'react-icons/fa';

const footerColumns = [
  [
    'Conocenos',
    'Encuentranos',
    'Informe 2024',
    'Tarifas',
    'Beneficios',
    'Trabaja con nosotros',
    'Transparencia y acceso a la informacion publica',
    'Nuestras politicas',
    'Terminos y condiciones',
    'Notificaciones judiciales',
  ],
  [
    'Te acompanamos',
    'Atencion y servicio a la ciudadania',
    'Presentar una peticion u observacion sobre los servicios',
    'Carta derechos y deberes afiliados',
    'Compromisos frente a la etica y el gobierno corporativo',
    'Ayudanos a mejorar, cuentanos tu experiencia',
    'Mapa de sitio',
  ],
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-social" aria-label="Redes sociales">
          <a href="#facebook" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#instagram" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#spotify" aria-label="Spotify">
            <FaSpotify />
          </a>
        </div>

        {footerColumns.map((column, index) => (
          <div className="footer-column" key={index}>
            {column.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        ))}

        <div className="footer-column footer-contact">
          <p className="title">Central de llamadas</p>
          <p>Para los demas municipios y regiones sin costo</p>
          <p className="phone">01 8000 415 455</p>
          <p>Valle de Aburra y Oriente cercano</p>
          <p className="phone">604 360 70 80</p>
        </div>
      </div>

      <div className="footer-bottom">Derechos reservados © 2026</div>
    </footer>
  );
};

export default Footer;
