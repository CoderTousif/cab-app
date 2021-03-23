const { Sequelize, Model, DataTypes } = require("sequelize");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

class User extends Model {
    async correctPassword(candidatePass, userPass) {
        // check if given login password is same as user password
        // candidatePass is not hashed but userPass is hashed
        // bcrypt takes care of that
        // returns true or false
        return bcrypt.compare(candidatePass, userPass);
    }

    changedPasswordAfter(JWTTimestamp) {
        // if passwordChangedAt field exist then compare
        if (this.passwordChangedAt) {
            const changedTimestamp = Number.parseInt(
                this.passwordChangedAt.getTime() / 1000,
                10
            );

            // returns true if changed
            return changedTimestamp > JWTTimestamp;
        }

        // password not changed
        return false;
    }

    createPasswordResetToken() {
        // temporary password for user to create real one
        const resetToken = crypto.randomBytes(32).toString("hex");
        // hashing - does not need strong encryption using builtin crypto
        this.passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        // validity of the reset token 20 minute
        this.resetTokenExpiresAt = Date.now() + 20 * 60 * 1000;

        // console.log({ resetToken, passwordResetToken: this.passwordResetToken });
        return resetToken;
    }
}

module.exports = (sequelize) => {
    // const User = sequelize.define(
    //     'user',
    User.init(
        {
            // Model attributes are defined here
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phoneNo: {
                type: DataTypes.BIGINT,
                // allowNull: false,
                unique: true,
                validate: {
                    len: {
                        args: [10, 14],
                        msg: "Valid phone number is required",
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: { msg: "A valid email is required" },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [10, 60],
                        msg: "Minimum length of password is 10",
                    },
                },
            },
            photo: {
                type: DataTypes.STRING,
                defaultValue: "default",
            },
            role: {
                type: DataTypes.STRING,
                defaultValue: "user",
                isIn: [["admin", "driver", "user"]],
            },
            rating: {
                type: DataTypes.SMALLINT,
            },
            passwordChangedAt: DataTypes.DATE,
            passwordResetToken: DataTypes.STRING,
            resetTokenExpiresAt: DataTypes.DATE,
        },
        {
            sequelize,
            tableName: "users",
            timestamps: true,
            // Using `unique: true` in an attribute above is exactly the same as creating the index in the model's options:
            //   indexes: [{ unique: true, fields: ['someUnique'] }]
        }
    );

    User.associate = (models) => {
        User.hasMany(models.Booking, {
            foreignKey: "userId",
            // {name: 'userId',field: 'user_id'}
        });

        User.hasOne(models.Car, {
            foreignKey: "id",
        });
    };

    User.beforeCreate(async (user, _options) => {
        // runs before create
        // user.passwordChangedAt = Date.now();
        // delete password confirm field
        user.confirmPassword = undefined;
        user.passwordResetToken = undefined;
        user.resetTokenExpiresAt = undefined;
        // user.changed()
        if (!user.name) {
            const { email } = user;
            // const randomString = crypto.randomBytes(4).toString('hex');
            user.name = `${email.split("@")[0]}`;
        }
    });

    User.beforeSave(async (user, _options) => {
        // runs before create or update

        // hash the password with the cost of 12 --- Strong Encryption
        if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 12);
        }
    });

    // User.beforeFind((user, options) => {});

    return User;
};
