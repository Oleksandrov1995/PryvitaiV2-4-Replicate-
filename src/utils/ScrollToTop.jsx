import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Отримуємо поточний шлях (URL)
  const { pathname } = useLocation();

  // Цей ефект буде спрацьовувати щоразу, коли змінюється `pathname`
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Цей компонент нічого не рендерить, він лише виконує дію
  return null;
};

export default ScrollToTop;