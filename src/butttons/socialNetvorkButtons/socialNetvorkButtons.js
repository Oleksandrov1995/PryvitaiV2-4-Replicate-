import React from 'react';
import { FaFacebookF, FaTelegramPlane, FaViber, FaWhatsapp } from 'react-icons/fa';
import './socialNetvorkButtons.css';

// Універсальні параметри:
// shareUrl: URL-адреса, якою ділимося.
// title: Текст, який буде додано до посилання.

export const FacebookShareButton = ({ shareUrl, title }) => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl || window.location.href)}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-social">
      <FaFacebookF />
      {/* Текст видалено */}
    </a>
  );
};

export const TelegramShareButton = ({ shareUrl, title }) => {
  const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl || window.location.href)}&text=${encodeURIComponent(title || '')}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-social">
      <FaTelegramPlane />
    </a>
  );
};

export const ViberShareButton = ({ shareUrl, title }) => {
  const url = `viber://forward?text=${encodeURIComponent(title || '')}%0A${encodeURIComponent(shareUrl || window.location.href)}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-social">
      <FaViber />
    </a>
  );
};

export const WhatsAppShareButton = ({ shareUrl, title }) => {
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(title || '')}%20${encodeURIComponent(shareUrl || window.location.href)}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-social">
      <FaWhatsapp />
    </a>
  );
};