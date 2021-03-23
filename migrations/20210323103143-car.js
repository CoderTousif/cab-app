"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         *
         */
        await queryInterface.createTable("cars", {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            model: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isIn: [["sedan", "suv", "hatchback", "sport", "minivan"]],
                },
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: "open",
                validate: {
                    isIn: [["open", "inTransit", "offline"]],
                },
            },
            location: {
                type: Sequelize.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            registrationNo: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                // We require names to have length of at least 2, and
                // only use letters, numbers and underscores.
                is: /^\w{2,}$/,
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
        });
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         *
         */
        await queryInterface.dropTable("cars");
    },
};
