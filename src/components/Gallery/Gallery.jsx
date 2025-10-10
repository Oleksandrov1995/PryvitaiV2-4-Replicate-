import React, { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./Gallery.css";
import {Download, Share } from "yet-another-react-lightbox/plugins";
import { API_URLS } from "../../config/api";

const Gallery = ({ apiEndpoint = API_URLS.GET_GALLERY }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1); // індекс відкритого зображення

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

  if (loading) return <div className="gallery-message">Завантаження галереї...</div>;
  if (error) return <div className="gallery-message">Помилка: {error}</div>;
  if (images.length === 0) return <div className="gallery-message">У вас ще немає збережених зображень.</div>;

  return (
    <div className="gallery-grid">
      {images.map((img, index) => (
        <div key={img.id} className="gallery-item">
          <img
            src={img.url}
            alt="Збережене зображення"
            onClick={() => setLightboxIndex(index)} // відкриваємо lightbox
            style={{ cursor: "pointer" }}
          />
          <div className="gallery-actions">
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(img, index);
              }}
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      {lightboxIndex >= 0 && (
        <Lightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={images.map((img) => ({ src: img.url }))}
          plugins={[Download, Share]}
        />
      )}
    </div>
  );
};

export default Gallery;
