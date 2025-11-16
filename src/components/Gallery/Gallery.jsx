import React, { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./Gallery.css";
import { Download, Share } from "yet-another-react-lightbox/plugins";
import { API_URLS } from "../../config/api";
import { FiTrash2, FiMoreVertical, FiCalendar, FiShare2, FiDownload, FiRefreshCw, FiEdit3 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Gallery = ({ apiEndpoint = API_URLS.GET_GALLERY }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1); // індекс відкритого зображення
  const [activeMenu, setActiveMenu] = useState(null); // індекс відкритого меню

  // Завантаження галереї
  useEffect(() => {
    let isCancelled = false;

    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(apiEndpoint, { headers });
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Отримано не JSON:", text);
          throw new Error("Сервер повернув не JSON. Можливо, неправильний URL або відсутній токен.");
        }
        if (!isCancelled) setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isCancelled) setError(err.message || "Не вдалося завантажити зображення");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchImages();

    return () => {
      isCancelled = true;
    };
  }, [apiEndpoint]);

  // Видалення зображення
  const handleDelete = async (img, index) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${apiEndpoint}/${index}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Помилка при видаленні.");
      setImages(images.filter((i) => i !== img));
    } catch (err) {
      console.error("Помилка видалення зображення:", err);
    }
  };

  // Функції для дій меню
  const handleAttachToEvents = (img) => {
    setActiveMenu(null);
    // Тут може бути логіка прикріплення до подій
    console.log("Attach to events:", img);
  };

  const handleShare = async (img) => {
    setActiveMenu(null);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Згенероване зображення',
          url: img.url
        });
      } catch (err) {
        console.log('Помилка при діленні:', err);
      }
    } else {
      // Fallback - копіювання посилання
      navigator.clipboard.writeText(img.url);
      alert('Посилання скопійовано в буфер обміну!');
    }
  };

  const handleDownload = (img) => {
    setActiveMenu(null);
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = (img) => {
    setActiveMenu(null);
    // Перехід до сторінки генерації з параметрами поточного зображення
    navigate('/StylizePhotoForPostcard', { state: { regenerateImage: img } });
  };

  const handleAddText = (img) => {
    setActiveMenu(null);
    // Перехід до редактора з поточним зображенням
    navigate('/editor', { state: { backgroundImage: img.url } });
  };

  if (loading) return <div className="gallery-message">Завантаження галереї...</div>;
  if (error) return <div className="gallery-message">Помилка: {error}</div>;
  if (images.length === 0) return <div className="gallery-message">У вас ще немає збережених зображень.</div>;

  return (
    <div 
      className="gallery-container"
      onClick={() => setActiveMenu(null)} // Закриваємо меню при кліку поза ним
    >
      <h2 className="gallery-header">Згенеровані зображення</h2>
      <div className="gallery-grid">
        {images.map((img, index) => (
          <div key={img.id || index} className="gallery-item">
            <img
              src={img.url}
              alt={`Згенероване зображення ${index + 1}`}
              onClick={() => setLightboxIndex(index)}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div class="no-image-placeholder">Зображення не завантажилось</div>';
              }}
            />
            <div className="gallery-actions">
              <button
                className="menu-toggle-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === index ? null : index);
                }}
                title="Меню дій"
              >
                <FiMoreVertical size={30} />
              </button>
              
              {activeMenu === index && (
                <div className="action-menu">
               
                  
                  <button
                    className="menu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(img);
                    }}
                  >
                    <FiShare2 size={16} />
                    <span>Поділитися</span>
                  </button>
                  
                  <button
                    className="menu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(img);
                    }}
                  >
                    <FiDownload size={16} />
                    <span>Завантажити</span>
                  </button>
                  
               
                  
               
                  
                  <button
                    className="menu-item delete-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img, index);
                    }}
                  >
                    <FiTrash2 size={16} />
                    <span>Видалити</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex >= 0 && (
        <Lightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={images.map((img) => ({ src: img.url }))}
          plugins={[Download, Share]}
          toolbar={{
            buttons: [
              "close",
              <button
                key="delete"
                type="button"
                className="lightbox-delete-button"
                onClick={() => {
                  const imgToDelete = images[lightboxIndex];
                  handleDelete(imgToDelete, lightboxIndex);
                }}
                title="Видалити зображення"
              >
                <FiTrash2 size={20} />
              </button>
            ]
          }}
        />
      )}
    </div>
  );
};

export default Gallery;
