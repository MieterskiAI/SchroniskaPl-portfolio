// backend/utils/validateShelter.js
// Prosta walidacja danych schroniska

function validateShelter(shelter) {
  const errors = [];

  if (!shelter.id || typeof shelter.id !== "string") {
    errors.push("Missing or invalid 'id'");
  }
  if (!shelter.name || shelter.name.length < 3) {
    errors.push("Missing or too short 'name'");
  }
  if (!shelter.address || shelter.address.length < 5) {
    errors.push("Missing or invalid 'address'");
  }
  if (!shelter.postalCode || !/^[0-9]{2}-[0-9]{3}$/.test(shelter.postalCode)) {
    errors.push("Missing or invalid 'postalCode' (expected format: 00-000)");
  }
  if (!shelter.city) {
    errors.push("Missing 'city'");
  }
  if (!shelter.phone) {
    errors.push("Missing 'phone'");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateShelter
};
