"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         */
        await queryInterface.createTable("users", {
            // Model attributes are defined here
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: true,
                validate: {
                    len: {
                        args: [10, 14],
                        msg: "Valid phone number is required",
                    },
                },
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: { msg: "A valid email is required" },
                },
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [10, 60],
                        msg: "Minimum length of password is 10",
                    },
                },
            },
            photo: {
                type: Sequelize.STRING,
                defaultValue: "default",
            },
            role: {
                type: Sequelize.STRING,
                defaultValue: "user",
                isIn: [["admin", "driver", "user"]],
            },
            rating: {
                type: Sequelize.SMALLINT,
            },
            passwordChangedAt: Sequelize.DATE,
            passwordResetToken: Sequelize.STRING,
            resetTokenExpiresAt: Sequelize.DATE,
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
