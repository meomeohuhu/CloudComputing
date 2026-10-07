const test = require("node:test");
const assert = require("node:assert/strict");
const STUDENT = require("../constants/student");
const {
  calculatePriceAfterTax,
  validateBookInput,
} = require("../utils/book");

test("VAT calculation uses the student VAT", () => {
  assert.equal(calculatePriceAfterTax(100000, STUDENT.vat), 106000);
});

test("validates the required product prefix", () => {
  assert.equal("262-TEST".startsWith(STUDENT.prefix), true);
  assert.equal("999-TEST".startsWith(STUDENT.prefix), false);
});

test("validates book input", () => {
  assert.equal(validateBookInput({ code: "262-TEST", name: "Cloud", price: 100000 }), null);
  assert.equal(
    validateBookInput({ code: "", name: "Cloud", price: 100000 }),
    "Mã sản phẩm không được để trống.",
  );
  assert.equal(
    validateBookInput({ code: "262-TEST", name: "Cloud", price: -1 }),
    "Giá gốc phải là một số không âm.",
  );
});
