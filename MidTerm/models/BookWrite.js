const { writeConnection } = require("../config/database");

const bookSchema = require("./bookSchema");

module.exports = writeConnection.model("BookWrite", bookSchema, "books");

