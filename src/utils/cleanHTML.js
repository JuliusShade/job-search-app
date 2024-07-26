// src/utils/cleanHTML.js
export const cleanHTML = (html) => {
  if (!html) {
    return "";
  }
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};
