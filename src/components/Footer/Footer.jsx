import React from "react";
import "./Footer.css";
import logo from "../../images/logo.png"; // Імпорт логотипу
import logoText from "../../images/logoText.png"; // Імпорт текстового логотипу
import { Link } from "react-router-dom";
import { FacebookShareButton, TelegramShareButton, ViberShareButton, WhatsAppShareButton } from "../../butttons/socialNetvorkButtons/socialNetvorkButtons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Логотип + опис */}
        <div className="footer-brand">
          <div className="logo">
        <Link to="/">
          <img src={logo} alt="Pryvitai Logo" style={{ height: '50px' }} /> <img src={logoText} alt="Pryvitai LogoText" style={{ height: '40px' }} />
        </Link>
      </div>
          <p>
            Ваш помічник у створенні незабутніх привітань на будь-яку подію.
          </p>
         {/* <div className="social-networks-footer">
               <ul className="social-networks-buttons-footer">
                 <li><FacebookShareButton /></li>
                 <li><TelegramShareButton /></li>
                 <li><ViberShareButton /></li>
                 <li><WhatsAppShareButton /></li>
               </ul>
             </div> */}
        </div>

        {/* Навігація */}
        <div className="footer-links">
          <div>
            <h4>Продукт</h4>
            <Link to="/calendar">Календар</Link>
            <Link to="/gallery">Галерея</Link>
            <Link to="/tariffs">Тарифи</Link>
            <Link to="/actions">Акції</Link>
            <Link to='/userpage'>Профіль</Link>
          </div>
          {/* <div>
            <h4>Ресурси</h4>
            <a href="#">Допомога</a>
            <a href="#">FAQ</a>
            <a href="#">Блог</a>
            <a href="#">Підтримка</a>
          </div> */}
          <div>
            <h4>Компанія</h4>
            <Link to="/aboutUs">Про нас</Link>
            <Link to="/userTips">Поради користувачам</Link>
            <Link to="/contact">Контакти</Link>
            <Link to="/regulation">Правила та умови</Link>
            <Link to="/agreement">Політика конфіденційності</Link>

          </div>
        </div>
      </div>

      {/* Копірайт */}
      {/* <div className="footer-bottom">
        © 2024 Привітання. Всі права захищено.
      </div> */}
    </footer>
  );
};

export default Footer;
