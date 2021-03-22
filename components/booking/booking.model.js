const { Sequelize, Model, DataTypes } = require("sequelize");

class Booking extends Model {}

module.exports = (sequelize) => {
    Booking.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: "initiated",
                isIn: [["initiated", "completed", "canceled", "inTransit"]],
            },
            initialLocation: {
                type: DataTypes.GEOMETRY("POINT"),
                allowNull: false,
            },
            finalLocation: {
                type: DataTypes.GEOMETRY("POINT"),
                allowNull: false,
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                index: true,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            carId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "cars",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            tableName: "bookings",
            timestamps: true,
        }
    );

    Booking.associate = (models) => {
        Booking.belongsTo(models.User, {
            foreignKey: "userId",
        });

        Booking.belongsTo(models.Car, {
            foreignKey: "carId",
        });
    };

    Booking.beforeValidate((booking, _options) => {
        booking.initialLocation = {
            type: "POINT",
            coordinates: booking.initialLocation,
        };
        booking.finalLocation = {
            type: "POINT",
            coordinates: booking.finalLocation,
        };
    });

    return Booking;
};
