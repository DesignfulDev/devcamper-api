// Load core modules
const path = require('path');

// Load 3rd party modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');

// Load enviroment variables
dotenv.config({ path: './config/config.env' });

// Load custom modules
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Connect to database
connectDB();

// Load router files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

// Create Express server
const app = express();

// Use body parser
app.use(express.json());

// Use cookie parser
app.use(cookieParser());

// Use developer loggin middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

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
