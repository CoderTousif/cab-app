const express = require("express");
const router = require("express").Router();
const { logger } = require("@tinyhttp/logger");
const sirv = require("sirv");
// const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const paginate = require("express-paginate");
const errorHandler = require("./error-handler");
const swaggerSpecs = require("./swagger");
// routes
const userRoutes = require("./components/user/user.routes");
const carRoutes = require("./components/car/car.routes");
const bookingRoutes = require("./components/booking/booking.routes");

const app = express();

app.use(express.json());
app.use(logger());

app.use(paginate.middleware(10, 50));

app.all(function (req, res, next) {
    // set default or minimum is 10 (as it was prior to v0.2.0)
    if (req.query.limit <= 10) req.query.limit = 10;
    if (req.body.limit <= 10) req.body.limit = 10;
    next();
});

// const specs = swaggerJsdoc(swaggerSpecs);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { explorer: true }));
app.use(userRoutes(router));
app.use(carRoutes(router));
app.use(bookingRoutes(router));

// app.on("error", (error) => {
//     console.log("=================================");
//     console.log("          Server Error           ");
//     console.log("=================================");
//     console.error(error);
// });

app.use(errorHandler);

module.exports = app;
