const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  console.log(
    `Successfully connected to ${conn.connection.db.databaseName} at ${conn.connection.host}`
      .cyan.underline.bold
  );
};

module.exports = connectDB;
