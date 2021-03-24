require("dotenv").config();

module.exports = {
    development: {
        username: "postgres",
        password: "postgres",
        database: "dev_uber",
        host: "127.0.0.1",
        dialect: "postgres",
        logging: false,
    },
    test: {
        username: "postgres",
        password: "postgres",
        database: "test_uber",
        host: "127.0.0.1",
        dialect: "postgres",
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DB,
        host: process.env.DB_HOST,
        dialect: "postgres",
        ssl: true,
        dialectOptions: {
            ssl: true,
        },
    },
};
