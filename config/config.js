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
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASS,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        dialect: "postgres",
    },
};
