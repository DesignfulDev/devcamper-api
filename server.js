// Load core modules

// Load 3rd party modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

// Load enviroment variables
dotenv.config({ path: './config/config.env' });

// Load custom modules
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Connect to database
connectDB();

// Load router files
const bootcamps = require('./routes/bootcamps');

// Create Express server
const app = express();

// Use body parser
app.use(express.json());

// Use developer loggin middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Use routers
app.use('/api/v1/bootcamps', bootcamps);

// Use middleware methods
app.use(errorHandler);

// Define PORT
const PORT = process.env.PORT || 5000;

// Fire up the Server
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handle Promise Rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server & exit process
  server.close(() => process.exit(1));
});
