const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const productRoute = require('./routes/product.route.js');
const userRoute = require('./routes/user.route.js');

const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verifyTransport } = require('./utils/sendEmail.js');

const app = express();
const PORT = process.env.PORT || 5000;
verifyTransport();

// middleware
app.use(
  cors({
    origin: 'http://localhost:3005',
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);

// connect DB
connectDB();

// start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
