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
                allowNull: false,
                validate: {
                    isIn: [["completed", "canceled", "inTransit"]],
                },
            },
            initialLocation: {
                type: DataTypes.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            finalLocation: {
                type: DataTypes.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
            as: "user",
        });

        Booking.belongsTo(models.Car, {
            foreignKey: "carId",
            as: "car",
        });
    };

    Booking.beforeValidate((booking, _options) => {
        // coordinates : [ longitude , latitude ]
        if (booking.initialLocation) {
            booking.initialLocation = {
                type: "POINT",
                coordinates: [booking.initialLocation[1], booking.initialLocation[0]],
            };
        }
        if (booking.finalLocation) {
            booking.finalLocation = {
                type: "POINT",
                coordinates: [booking.finalLocation[1], booking.finalLocation[0]],
            };
        }
    });

    return Booking;
};
