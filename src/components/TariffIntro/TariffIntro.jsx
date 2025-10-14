import React from "react";
import "./TariffIntro.css";
import introPNG from "../../images/introPNG.png";
const TariffIntro = ({ onChooseStyle, onUploadPhoto, onChooseAddons, onStart }) => {
	const scrollToTariffPlan = () => {
		const tariffPlanElement = document.querySelector('.pricing-title');
		if (tariffPlanElement) {
			tariffPlanElement.scrollIntoView({ 
				behavior: 'smooth',
				block: 'start'
			});
		}
	};

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

        <button className="hero-cta" onClick={scrollToTariffPlan}>
          Створювати привітайки
        </button>
      </div>
    </section>
	);
};

export default TariffIntro;

