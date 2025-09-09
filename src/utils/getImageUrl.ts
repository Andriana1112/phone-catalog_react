export const getImageUrl = (imagePath: string): string => {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://andriana1112.github.io/phone-catalog_react'
      : '';

  return `${baseUrl}${imagePath}`;
};
