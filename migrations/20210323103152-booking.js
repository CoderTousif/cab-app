"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         */
        await queryInterface.createTable("bookings", {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isIn: [["completed", "canceled", "inTransit"]],
                },
            },
            initialLocation: {
                type: Sequelize.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            finalLocation: {
                type: Sequelize.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                index: true,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            carId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "cars",
                    key: "id",
                },
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         */
        await queryInterface.dropTable("bookings");
    },
};
