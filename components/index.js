const { Sequelize } = require("sequelize");
const config = require("../config/config")[process.env.NODE_ENV];
const user = require("./user/user.model");
const booking = require("./booking/booking.model");
const car = require("./car/car.model");

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

const models = {
    User: user(sequelize),
    Car: car(sequelize),
    Booking: booking(sequelize),
};

// We define all models according to their files.
// for (const modelDefiner of modelDefiners) {
//     modelDefiner(sequelize);
// }

Object.keys(models).forEach((modelName) => {
    if ("associate" in models[modelName]) {
        models[modelName].associate(models);
    }
});

module.exports = { sequelize, models, Sequelize };
