require("dotenv").config();

const { sequelize } = require("./components");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const init = async () => {
    try {
        await sequelize.sync();
        // await sequelize.authenticate();
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log("Server running");
        });
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
