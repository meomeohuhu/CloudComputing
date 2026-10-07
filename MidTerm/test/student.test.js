const test = require("node:test");
const assert = require("node:assert/strict");
const STUDENT = require("../constants/student");

test("student constants are derived from MSSV", () => {
  assert.equal(STUDENT.name, "Nguyễn Thành Thịnh");
  assert.equal(STUDENT.studentId, "23IT262");
  assert.equal(STUDENT.prefix, "262");
  assert.equal(STUDENT.lastDigit, 2);
  assert.equal(STUDENT.vat, 7);
  assert.equal(STUDENT.databaseName, "DB_23IT262");
});

