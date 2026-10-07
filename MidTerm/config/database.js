const mongoose = require("mongoose");
const STUDENT = require("../constants/student");

function createRoleConnection(envKey, role) {
  const uri = process.env[envKey];

  if (!uri) {
    throw new Error(`Thiếu biến môi trường ${envKey}. Hãy tạo file .env từ .env.example.`);
  }

  const connection = mongoose.createConnection(uri, {
    dbName: STUDENT.databaseName,
    appName: `cloud-book-${STUDENT.studentId}-${role}`,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  connection.on("error", (error) => {
    console.error(`[MongoDB ${role}]`, error.message);
  });

  return connection;
}

const readConnection = createRoleConnection("MONGO_READ_URI", "read");
const writeConnection = createRoleConnection("MONGO_WRITE_URI", "write");

async function connectDatabases() {
  await Promise.all([readConnection.asPromise(), writeConnection.asPromise()]);
  console.log(`MongoDB đã kết nối tới database ${STUDENT.databaseName}.`);
}

module.exports = {
  readConnection,
  writeConnection,
  connectDatabases,
};
