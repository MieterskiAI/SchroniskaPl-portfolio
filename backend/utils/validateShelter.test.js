const test = require("node:test");
const assert = require("node:assert/strict");

const { validateShelter } = require("./validateShelter");

test("validateShelter returns errors for missing fields", () => {
  const result = validateShelter({});

  assert.equal(result.isValid, false);
  assert.ok(result.errors.length > 0);
});

test("validateShelter accepts a valid shelter record", () => {
  const result = validateShelter({
    id: "abc-123",
    name: "Schronisko Miejskie",
    address: "ul. Kwiatowa 1",
    postalCode: "00-001",
    city: "Warszawa",
    phone: "+48 123 456 789"
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, []);
});
