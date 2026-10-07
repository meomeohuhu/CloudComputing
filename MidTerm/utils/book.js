function calculatePriceAfterTax(price, vat) {
  return Number((price * (1 + vat / 100)).toFixed(2));
}

function validateBookInput({ code, name, price }) {
  if (!code) {
    return "Mã sản phẩm không được để trống.";
  }

  if (!name) {
    return "Tên sách không được để trống.";
  }

  if (price === "" || price === null || price === undefined) {
    return "Giá gốc không được để trống.";
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return "Giá gốc phải là một số không âm.";
  }

  return null;
}

module.exports = {
  calculatePriceAfterTax,
  validateBookInput,
};

