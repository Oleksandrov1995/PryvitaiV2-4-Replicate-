
import './MainButtons.css';
import { useNavigate } from 'react-router-dom';

const MainButtons = () => {
  const navigate = useNavigate();

  // Функція перевірки авторизації
  const checkAuthAndNavigate = (path) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/SignIn');
      return;
    }
    navigate(path);
  };
  return (
  <div className="main-buttons">
      
    
        <button className="main-btn" onClick={() => checkAuthAndNavigate("/StylizePhotoForPostcard")}>Стилізувати фото під листівку</button>
            <button className="main-btn" onClick={() => checkAuthAndNavigate("/GenerateFluffyGreeting")}>Привітання від домашнього улюбленця</button>
       <button className="main-btn" onClick={() => checkAuthAndNavigate("/GenerateText")}>Текстове привітання</button>
      </div>
  );
};

export default MainButtons;