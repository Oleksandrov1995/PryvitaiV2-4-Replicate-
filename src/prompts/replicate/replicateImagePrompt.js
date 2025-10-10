// Replicate промпти для генерації зображень

export const replicateImagePrompt = (formData) => {
  return `Сформуй короткий, художній промт для генерації зображення через Replicate, стиль зображення - ${formData.cardStyle}, настрій зображення - ${formData.cardMood}.
Можеш додати до композиції сюжету наступні атрибути та символи${formData.hobbies}.
Також врахуй риси та цінності особистості: ${formData.traits}. Зберігай обличчя як на фото.
`;
};

