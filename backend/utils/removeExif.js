// backend/utils/removeExif.js
// Mock funkcji usuwającej metadane EXIF ze zdjęć.
// W realnym projekcie można użyć biblioteki "exiftool-vendored" lub "sharp".

function removeExif(buffer) {
  // Zwracamy ten sam buffer – bo to tylko mock funkcjonalności
  return buffer;
}

module.exports = { removeExif };
