const getNearbyCars = {
    tags: ["Cars"],
    summary: "Returns nearby cars",
    description: "Return 5 available cars near by location of the user",
    // operationId: "getcars",
    parameters: [
        {
            in: "query",
            name: "lng",
            required: true,
            schema: {
                type: "number",
                description: "longitude of user",
            },
        },
        {
            in: "query",
            name: "lat",
            required: true,
            schema: {
                type: "number",
                description: "longitude of user",
            },
        },
        {
            in: "query",
            name: "maxDistance",
            required: true,
            schema: {
                type: "number",
                description: "max distance of car the user wants to search",
            },
        },
    ],
    security: [
        {
            bearerAuth: [],
        },
    ],
    produces: ["application/json"],
    responses: {
        200: {
            description: "A list of cars.",
            schema: {
                type: "array",
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
            content: {
                schema: {
                    type: "string",
                    description: "Error processing the request from host db",
                },
            },
        },
    },
};

module.exports = {
    getNearbyCars,
};
