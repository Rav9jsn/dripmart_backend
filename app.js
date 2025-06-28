// Import modules

const express = require("express");
const cors= require('cors')

// Import routes
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/prouductroutes");
const favRouter = require("./routes/FavouriteRoutes");
const cartRouter = require("./routes/cartRout");
const paymentRouter = require('./routes/paymentRoute')
const orderRouter = require('./routes/OrderRoute')
const { envData } = require("./config");
const {mongoConnect} = require("./util/databaseUtil");


// Initialize app
const app = express();
app.use(cors({
   origin: ['https://drip-mart.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));


app.use(express.json()); // To parse JSON body
app.use(express.urlencoded({ extended: true })); // For form data


// port
const port = envData.port;

// Register routes
app.use('/auth',authRouter);
app.use('/product',productRouter);
app.use('/favourites',favRouter);
app.use('/cart',cartRouter);
app.use('/pay',paymentRouter);
app.use('/order',orderRouter);
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

//404 no rote find
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// Start server
mongoConnect(() => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
});
