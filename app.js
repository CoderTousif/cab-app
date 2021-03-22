const express = require("express");
const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();

const app = express();

app.use(express.json());
app.use(express.static(pathToSwaggerUi));
// routes
const userRouter = require("./components/user/user.routes");
const carRouter = require("./components/car/car.routes");
const bookingRouter = require("./components/booking/booking.routes");

app.use("/users", userRouter);
app.use("/cars", carRouter);
app.use("/bookings", bookingRouter);

// app.on("error", (error) => {
//     console.log("=================================");
//     console.log("          Server Error           ");
//     console.log("=================================");
//     console.error(error);
// });

app.use((err, _req, res, _next) => {
    console.log(err.name);
    if (err.statusCode < 500) {
        res.status(err.statusCode).json({
            ok: false,
            error: { statusCode: err.statusCode, message: err.message },
            stack: err.stack,
        });
    } else {
        const statusCode = err.statusCode || 500;
        let message = "Something went wrong";
        if (err?.errors && err?.errors[0]?.message) {
            message = err?.errors[0]?.message;
        }

        console.log(err);
        res.status(statusCode).json({
            ok: false,
            error: { statusCode: statusCode, message },
        });
    }
});

module.exports = app;
