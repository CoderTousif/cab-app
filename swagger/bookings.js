const getUserBookings = {
    tags: ["Bookings"],
    summary: "Get the booking of a user",
    description: "Returns the 10 bookings per page to the user",
    operationId: "getcars",
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: "query",
            name: "page",
            required: true,
            schema: {
                type: "number",
                description: "page no. ",
            },
        },
    ],
    produces: ["application/json"],
    responses: {
        200: {
            description: "List of Bookings",
            schema: {
                type: "array",
                description: "list of user bookings",
            },
        },
        401: {
            description: "Unauthorized",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "list of user bookings",
                    },
                },
            },
        },
        500: {
            description: "Server Error",
            schema: {
                type: "string",
                description: "Error processing the request from host db",
            },
        },
    },
};

const createBooking = {
    tags: ["Bookings"],
    summary: "Add a new Booking",
    parameters: [
        {
            in: "query",
            name: "maxDistance",
            required: true,
            schema: {
                type: "number",
                description: "max distance of car from user",
            },
        },
    ],
    security: [
        {
            bearerAuth: [],
        },
    ],
    requestBody: {
        description: "New Booking Object",
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        initial_loc: {
                            type: "array",
                            items: {
                                type: "number",
                            },
                        },
                        final_loc: {
                            type: "array",
                            items: {
                                type: "number",
                            },
                        },
                        booking_amt: {
                            type: "number",
                        },
                    },
                },
            },
        },
    },
    produces: ["application/json"],
    responses: {
        201: {
            description: "Booking created",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "Booking Status",
                    },
                },
            },
        },
        401: {
            description: "Unauthorized",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "list of user bookings",
                    },
                },
            },
        },
        409: {
            description: "Booking Conflict",
            schema: {
                type: "string",
                items: {
                    message: {
                        type: "string",
                        description: "User Has existing Booking ",
                    },
                },
            },
        },
        500: {
            description: "Server Error",
            schema: {
                type: "string",
                description: "Error processing the request from host db",
            },
        },
    },
};

module.exports = {
    getUserBookings,
    createBooking,
};
