"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         */
        await queryInterface.bulkInsert("users", [
            {
                name: "John Doe",
                email: "john@doe.com",
                phone: "0123456789",
                password: "password21",
                confirmPassword: "password21",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Jane Doe",
                email: "jane@doe.com",
                phone: "1234567890",
                password: "password21",
                confirmPassword: "password21",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         */
        await queryInterface.bulkDelete("users", null, {});
    },
};
