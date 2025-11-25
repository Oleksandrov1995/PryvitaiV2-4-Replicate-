export const createPromptFluxKontextPro = (formData) => `
Design the image in a ${formData.cardStyle} style,
beautifully redraw person from the photo
draw the ${formData.background} in the Background or additional details.
`;
export const createCristmasPromt = (formData) => `
Design the image in a ${formData.cardStyle} style. Beautifully redraw person from the photo. Person is on a pillow with gifts under it, add a Santa Claus hat to the character, and decorate the top of the image with Christmas tree branches with Christmas toys and snowflakes.
`;

// Список стилів, які треба малювати через Gen4
// Ключові слова для Gen4 (якщо будь-яке з них зустрічається в cardStyle → беремо Gen4)
const gen4Keywords = [
  "Комікс",
  "Кіберпанк",
  "Афіша",
  "Афіші",
  "Постер",
  "Постеру",
  "Постера",
  "Альбом",
  "Альбому",
  "Пірат",
  "Модернізм",
];

// Універсальний експорт
export const StylizePhotoForPostcardApiSetting = (
  formData,
  generatedPrompt,
  photoUrl
) => {
  const isGen4 = gen4Keywords.some((keyword) =>
    formData.cardStyle.toLowerCase().includes(keyword.toLowerCase())
  );

  if (isGen4) {
    return {
      modelId: "runwayml/gen4-image-turbo",
      input: {
        prompt: generatedPrompt,
        reference_images: [photoUrl],
        resolution: "1080p",
        aspect_ratio: "4:3",
        // strength: 0.8
      },
    };
  }
  return {
    modelId: "black-forest-labs/flux-kontext-pro",
    input: {
      prompt: generatedPrompt,
      input_image: photoUrl,
      aspect_ratio: "match_input_image",
      // strength: 0.8
    },
  };
};
