"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         */
        await queryInterface.createTable("cars", {
            id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            model: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: Sequelize.DataTypes.STRING,
                defaultValue: "open",
            },
            location: {
                type: Sequelize.DataTypes.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            registrationNo: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true,
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
            createdAt: Sequelize.DataTypes.DATE,
            updatedAt: Sequelize.DataTypes.DATE,
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
