// backend/utils/generateThumbnail.js
// Mock funkcji generującej miniaturę zdjęcia.
// W prawdziwej implementacji można użyć biblioteki "sharp".

function generateThumbnail(buffer, width = 200) {
  return {
    thumbnailBuffer: buffer,
    width,
    note: "This is a mock thumbnail, real image processing is not yet implemented."
  };
}

module.exports = { generateThumbnail };
