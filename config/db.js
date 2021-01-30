const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(
    `Successfully connected to ${conn.connection.db.databaseName} at ${conn.connection.host}`
  );
};
