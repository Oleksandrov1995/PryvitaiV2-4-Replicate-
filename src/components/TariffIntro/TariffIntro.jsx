import React from "react";
import { FiEdit3, FiUploadCloud, FiPlusCircle } from "react-icons/fi";
import "./TariffIntro.css";
import introPNG from "../../images/introPNG.png";
const TariffIntro = ({ onChooseStyle, onUploadPhoto, onChooseAddons, onStart }) => {
	return (
	  <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Створюйте яскраві візуальні привітання <br /> на основі фото
        </h1>

        <div className="hero-options">
          <img src={introPNG} alt="Intro steps" className="hero-options-image" />
        </div>

        <p className="hero-subtext">
          Та листівку буде створено привітайком за хвилину
        </p>

        <button className="hero-cta">Створювати привітайки</button>
      </div>
    </section>
	);
};

export default TariffIntro;

