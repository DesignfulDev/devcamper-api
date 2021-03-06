// Load core modules
const path = require('path');

// Load 3rd party modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Load enviroment variables
dotenv.config({ path: './config/config.env' });

// Load custom modules
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const timeConverter = require('./utils/timeConverter');

// Connect to database
connectDB();

// Load router files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

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

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Set rate limit
const limiter = rateLimit({
  windowMs: timeConverter.toMilliseconds(10, 'minutes'),
  max: 100,
});

app.use(limiter);

// Prevent HTTP param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, '/public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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
