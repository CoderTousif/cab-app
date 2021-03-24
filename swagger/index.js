// const path = require('path');
const users = require("./users");
const cars = require("./cars");
const bookings = require("./bookings");

module.exports = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "Demo wed-sol api",
        description: "A minimal rest api to serve ola like application",
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "local dev",
        },
    ],
    // tags: [
    //     {
    //         name: "users",
    //         description: "Operations about user",
    //     },
    //     {
    //         name: "cars",
    //         description: "Operations about car",
    //     },
    //     {
    //         name: "bookings",
    //         description: "Everything about your booking",
    //     },
    // ],
    consumes: ["application/json"],
    produces: ["application/json"],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: {
        bearerAuth: [],
    },
    paths: {
        "/users/signup": {
            post: users.signup,
        },
        "/users/login": {
            post: users.login,
        },
        "/cars/near-by?lat={lat}&lng={lng}": {
            get: cars.getNearbyCars,
        },
        "/bookings/create": {
            post: bookings.createBooking,
        },
        "/bookings": {
            get: bookings.getUserBookings,
        },
    },
};
