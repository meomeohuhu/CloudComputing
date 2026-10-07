const express = require("express");
const STUDENT = require("../constants/student");
const BookRead = require("../models/BookRead");
const BookWrite = require("../models/BookWrite");
const {
  calculatePriceAfterTax,
  validateBookInput,
} = require("../utils/book");

const router = express.Router();

function formValues(body = {}) {
  return {
    code: body.code || "",
    name: body.name || "",
    price: body.price || "",
  };
}

router.get("/", async (req, res, next) => {
  try {
    req.session.visitCount = (req.session.visitCount || 0) + 1;
    const books = await BookRead.find().sort({ createdAt: -1 }).lean();

    res.render("home", {
      title: "Quản Lý Sách Trực Tuyến",
      books,
      form: {},
    });
  } catch (error) {
    next(error);
  }
});

// Keep refreshes after a failed form submission on the canonical home route.
router.get("/books", (req, res) => {
  res.redirect("/");
});

router.post("/books", async (req, res, next) => {
  const form = formValues(req.body);
  const inputError = validateBookInput(form);

  if (inputError) {
    return res.status(400).render("home", {
      title: "Quản Lý Sách Trực Tuyến",
      books: [],
      form,
      error: inputError,
    });
  }

  if (!form.code.startsWith(STUDENT.prefix)) {
    return res.status(400).render("home", {
      title: "Quản Lý Sách Trực Tuyến",
      books: [],
      form,
      error: `Mã sản phẩm phải bắt đầu bằng ${STUDENT.prefix} (3 số cuối MSSV ${STUDENT.studentId}).`,
    });
  }

  const price = Number(form.price);

  try {
    await BookWrite.create({
      code: form.code,
      name: form.name,
      price,
      vat: STUDENT.vat,
      priceAfterTax: calculatePriceAfterTax(price, STUDENT.vat),
    });

    return res.redirect("/");
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
