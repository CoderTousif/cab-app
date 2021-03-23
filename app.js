// const express = require("express");
const { App } = require("@tinyhttp/app");
const { logger } = require("@tinyhttp/logger");
const sirv = require("sirv");
const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
const paginate = require("express-paginate");
const errorHandler = require("./error-handler");
// routes
const userRouter = require("./components/user/user.routes");
const carRouter = require("./components/car/car.routes");
const bookingRouter = require("./components/booking/booking.routes");

const app = new App({
    onError: errorHandler,
});

app.use(logger());
app.use("/", sirv(pathToSwaggerUi));

app.use(paginate.middleware(10, 50));

app.all(function (req, res, next) {
    // set default or minimum is 10 (as it was prior to v0.2.0)
    if (req.query.limit <= 10) req.query.limit = 10;
    if (req.body.limit <= 10) req.body.limit = 10;
    next();
});

app.use("/users", userRouter);
app.use("/cars", carRouter);
app.use("/bookings", bookingRouter);

// app.on("error", (error) => {
//     console.log("=================================");
//     console.log("          Server Error           ");
//     console.log("=================================");
//     console.error(error);
// });

module.exports = app;
