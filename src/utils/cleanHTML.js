// src/utils/cleanHTML.js
export const cleanHTML = (html) => {
  // Remove HTML tags using regex
  let cleaned = html.replace(/<\/?[^>]+(>|$)/g, "");

  // Replace multiple spaces with a single space
  cleaned = cleaned.replace(/\s\s+/g, " ");

  // Trim any leading or trailing whitespace
  cleaned = cleaned.trim();

  return cleaned;
};
