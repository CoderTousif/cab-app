"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         */
        await queryInterface.createTable("bookings", {
            id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            status: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            initialLocation: {
                type: Sequelize.DataTypes.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            finalLocation: {
                type: Sequelize.DataTypes.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            amount: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: Sequelize.DataTypes.UUID,
                allowNull: false,
                index: true,
                references: {
                    model: { tableName: "users" },
                    key: "id",
                },
            },
            carId: {
                type: Sequelize.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: { tableName: "cars" },
                    key: "id",
                },
            },
            createdAt: Sequelize.DataTypes.DATE,
            updatedAt: Sequelize.DataTypes.DATE,
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
