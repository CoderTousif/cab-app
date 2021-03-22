const { Sequelize, Model, DataTypes } = require("sequelize");

class Car extends Model {}

module.exports = (sequelize) => {
    Car.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            model: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["sedan", "suv", "hatchback", "sport"]],
                },
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: "open",
                validate: {
                    isIn: [["open", "inTransit", "offline"]],
                },
            },
            location: {
                type: DataTypes.GEOMETRY("POINT"),
                allowNull: false,
            },
            registrationNo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                // We require names to have length of at least 2, and
                // only use letters, numbers and underscores.
                is: /^\w{2,}$/,
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
        },
        {
            sequelize,
            tableName: "cars",
            timestamps: true,
        }
    );

    Car.associate = (models) => {
        Car.belongsTo(models.User, {
            foreignKey: "userId",
        });
    };

    Car.beforeValidate((car, _options) => {
        // coordinates : [ longitude , latitude ]
        car.location = {
            type: "POINT",
            coordinates: car.location,
        };
    });

    return Car;
};
