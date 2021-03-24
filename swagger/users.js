const signup = {
    tags: ["Users"],
    summary: "Signup user",
    description: "",
    operationId: "signup_user",
    consumes: ["application/json"],
    produces: ["application/json"],
    requestBody: {
        description: "User email, phone, password and confirmPassword",
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                        },
                        email: {
                            type: "string",
                        },
                        phone: {
                            type: "integer",
                        },
                        password: {
                            type: "string",
                        },
                        confirmPassword: {
                            type: "string",
                        },
                    },
                },
            },
        },
    },
    responses: {
        202: {
            description: "Users signed up successfully",
            schema: {
                type: "object",
                items: {
                    message: {
                        type: "string",
                        description: "auth status",
                    },
                    token: {
                        type: "string",
                        description: "token for auth",
                    },
                },
            },
        },
        409: {
            description: "Conflict",
            schema: {
                type: "string",
                items: {
                    message: {
                        type: "string",
                        description: "user credentials conflict",
                    },
                },
            },
        },
    },
};

const login = {
    tags: ["Users"],
    summary: "Add a new user",
    requestBody: {
        description: "Cat Object",
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                        },
                        password: {
                            type: "string",
                        },
                        phone: {
                            type: "number",
                        },
                    },
                },
            },
        },
    },
    produces: ["application/json"],
    responses: {
        200: {
            description: "Users logged in",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "user stats",
                    },
                },
            },
        },
        409: {
            description: "User Already exists",
            schema: {
                type: "string",
                items: {
                    message: {
                        type: "string",
                        description: "user email id already present",
                    },
                },
            },
        },
        500: {
            description: "Server Error",
            schema: {
                type: "string",
                items: {
                    message: {
                        type: "string",
                        description: "Error processing the request from host db",
                    },
                },
            },
        },
    },
};

module.exports = {
    login,
    signup,
};
