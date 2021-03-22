const users = require("./users");
const cars = require("./car");
const booking = require("./booking");

module.exports = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "Demo wed-sol api",
        description: "A minimal rest api to serve ola like application",
    },
    servers: [
        {
            url: "http://localhost:5000/api",
            description: "local dev",
        },
    ],
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
        "/login": {
            post: users.signuser,
        },
        "/signup": {
            post: users.postuser,
        },
        "/nearbycars/?lng={lng}&lat={lat}&maxDistance={maxDistance}": {
            get: cars.get_nearby_car,
        },
        "/bookings?page={page}": {
            get: booking.getuserbookings,
        },
        "/book?maxDistance={maxDistance}": {
            post: booking.makebookings,
        },
    },
};
