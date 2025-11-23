
import './MainButtons.css';
import { useNavigate } from 'react-router-dom';

const MainButtons = () => {
  const navigate = useNavigate();

  return (
  <div className="main-buttons">
      
    
        <button className="main-btn" onClick={() => navigate("/StylizePhotoForPostcard")}>Стилізувати фото під листівку</button>
            <button className="main-btn" onClick={() => navigate("/GenerateFluffyGreeting")}>Привітання від домашнього улюбленця</button>
       <button className="main-btn" onClick={() => navigate("/GenerateText")}>Текстове привітання</button>
       <button className="main-btn saint-nicholas-btn" onClick={() => navigate("/UniversalGreetingPage")}>
         🎅 Привітання від святого Миколая ✨
       </button>
      </div>
  );
};

export default MainButtons;