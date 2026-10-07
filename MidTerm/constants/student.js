const STUDENT = {
  name: "Nguyễn Thành Thịnh",
  studentId: "23IT262",
};

STUDENT.prefix = STUDENT.studentId.slice(-3);

const lastDigit = Number.parseInt(
  STUDENT.studentId.charAt(STUDENT.studentId.length - 1),
  10,
);

STUDENT.lastDigit = lastDigit;
STUDENT.vat = lastDigit + 5;
STUDENT.databaseName = `DB_${STUDENT.studentId}`;

module.exports = STUDENT;
