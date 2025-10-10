import React from 'react';
import introPNG from "../../images/introPNG.png";
import './ActionsIntro.css';

const ActionsIntro = () => {
	return (
	  <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Створюйте яскраві візуальні привітання <br /> на основі фото безкоштовно
        </h1>

        <div className="hero-options">
          <img src={introPNG} alt="Intro steps" className="hero-options-image" />
        </div>

        <p className="hero-subtext">
          Та листівку буде створено привітайком за хвилину
        </p>

        <button className="hero-cta">Створювати привітайки безкоштовно</button>
      </div>
    </section>
	);
};

export default ActionsIntro;

