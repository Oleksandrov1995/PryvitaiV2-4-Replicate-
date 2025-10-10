import { API_URLS } from "./api";



export async function saveImageToGallery(imageUrl) {
  const token = localStorage.getItem("token"); // беремо токен з localStorage
  if (!token) {
    console.warn("❌ Немає токена. Користувач не авторизований.");
    return;
  }

  try {
    const response = await fetch(API_URLS.GALLERY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Не вдалося додати зображення.");
    }

    console.log("✅ Зображення додано в галерею:", data.message);
  } catch (err) {
    console.error("❌ Помилка при додаванні в галерею:", err);
  }
}
