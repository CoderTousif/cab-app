"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         */
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: Sequelize.DataTypes.BIGINT,
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            photo: {
                type: Sequelize.DataTypes.STRING,
                defaultValue: "default",
            },
            role: {
                type: Sequelize.DataTypes.STRING,
                defaultValue: "user",
            },
            rating: {
                type: Sequelize.DataTypes.SMALLINT,
                allowNull: true,
            },
            passwordChangedAt: Sequelize.DataTypes.DATE,
            passwordResetToken: Sequelize.DataTypes.STRING,
            resetTokenExpiresAt: Sequelize.DataTypes.DATE,
            createdAt: Sequelize.DataTypes.DATE,
            updatedAt: Sequelize.DataTypes.DATE,
        });
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         */
        await queryInterface.dropTable("users");
    },
};
