import React from "react";
import "./ContactUs.css";
import { Link } from "react-router-dom";
// 1. Імпортуємо зображення як змінну
import contactUsImage from "../../images/contactUsOffice.png";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import {
  FacebookShareButton,
  TelegramShareButton,
  ViberShareButton,
  WhatsAppShareButton,
} from "../../butttons/socialNetvorkButtons/socialNetvorkButtons";
const ContactUs = () => {
  return (
    <section>
      <div className="contact-info">
        <div>
          <h2 className="contact-title">Зв'яжіться з нами</h2>
          <p className="contact-text">
            Ми тут, щоб відповісти на ваші запитання та допомогти вам з
            будь-якими потребами. Будь ласка, не соромтеся зв’язатися з нами.
          </p>
          <p>
            {" "}
            <a
              href="mailto:info@pryvitai.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaEnvelope />
              info@pryvitai.com
            </a>
          </p>
          <p>
            <a
              href="tel:+380507146471"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaPhone /> +380 50 71 464 71
            </a>
          </p>
        </div>
        <div className="contact-image">
          <img src={contactUsImage} alt="Офіс" />
        </div>
      </div>
      <div className="support-buttons">
        {/* <button className="btn outline">Написати в тех підтримку</button> */}
        <Link to="/userQuestions" className="btn outline">
          Запитання та відповіді
        </Link>
       <Link to="/userTips" className="btn outline">
          Поради користувачам
        </Link>
      </div>
      {/* <div className="social-share-section">
        <p className="social-share-title">
          Слідкуйте за нами в соціальних мережах
        </p>
        <ul className="social-share-buttons">
          <li>
            <FacebookShareButton />
          </li>
          <li>
            <TelegramShareButton />
          </li>
          <li>
            <ViberShareButton />
          </li>
          <li>
            <WhatsAppShareButton />
          </li>
        </ul>
      </div> */}
    </section>
  );
};

export default ContactUs;
