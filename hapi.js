require("dotenv").config();
const Hapi = require("@hapi/hapi");
const Boom = require("@hapi/boom");

const { models, sequelize } = require("./components");
const app = require("./app");
app.context.models = models;

const PORT = process.env.PORT || 5000;

const init = async () => {
    try {
        const server = Hapi.server({
            port: PORT,
            host: "localhost",
        });

        await sequelize.sync({ alter: true });
        console.log("Database connected");

        // server.register();

        server.route({
            method: "GET",
            path: "/",
            handler: (request, h) => {
                return "Hello Hapi";
            },
        });

        await server.start();
        console.log("Server running on %s", server.info.uri);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

process.on("unhandledRejection", (error) => {
    console.error(error);
    console.log("Shutting Down the server...");

    // kill
    process.exit(1);
});

init();
