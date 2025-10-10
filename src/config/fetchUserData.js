// ...existing code (замініть файл повністю)...
import { API_URLS } from './api';

/**
 * Завантажує дані користувача.
 * @param {object} deps
 * @param {string} deps.token
 * @param {function} deps.navigate
 * @param {function} deps.setProfile
 * @param {function} deps.setStats
 * @param {function} deps.setError
 * @param {function} deps.setLoading
 */
export const fetchUserData = async ({
  token,
  navigate,
  setProfile,
  setStats,
  setError,
  setLoading
}) => {
  try {
    const res = await fetch(API_URLS.GET_ME, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('storage'));
      navigate('/SignIn');
      return;
    }

    if (!res.ok) {
      throw new Error('Failed to load profile');
    }

    const data = await res.json();

    if (data?.user) {
      const user = data.user;
      setProfile({
        name: user.name || '—',
        email: user.email || '—',
        avatar: user.avatar || 'https://i.pravatar.cc/70',
        tagline: user.tagline || "A passionate creator capturing life's moments"
      });
      setStats({
        photos: Array.isArray(user.gallery) ? user.gallery.length : 0,
        events: user.eventsCount || 0
      });
    }
  } catch (e) {
    console.error('fetchUserData error:', e);
    setError('Не вдалося завантажити профіль');
  } finally {
    setLoading(false);
  }
};