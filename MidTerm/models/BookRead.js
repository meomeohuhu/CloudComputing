const { readConnection } = require("../config/database");

const bookSchema = require("./bookSchema");

module.exports = readConnection.model("BookRead", bookSchema, "books");

