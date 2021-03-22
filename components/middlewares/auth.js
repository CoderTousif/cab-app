const { promisify } = require("util"); // promisify() makes a synchronous function asynchronous
const jwt = require("jsonwebtoken");
// const crypto = require('crypto');
const AppError = require("../../utils/app-error");
const catchAsyncError = require("../../utils/catch-async-err");
const {
    models: { User },
} = require("../index");

// authentication --- Access to logged in user
exports.protect = async (request, _response, next) => {
    let token = request.headers.authorization;
    if (!token) {
        token = request.headers.cookie("token");
    }
    // remove quotes if any
    // token = token.replace(/^"(.*)"$/, '$1');
    if (!token || !token.startsWith("Bearer")) {
        return next(new AppError(403, "You need to login to get access"));
    }

    // extract the token part from the string // remove quotes if any
    token = token.split(" ")[1].replace(/^"(.*)"$/, "$1");
    // refreshToken = refreshToken.split(' ')[1].replace(/^"(.*)"$/, '$1');

    // verify token and extract data
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user exists
    const user = await User.findByPk(decodedToken.id);
    if (!user) {
        return next(new AppError(403, "Please login first"));
    }

    // check if user has changed password after the token was issued
    if (user.changedPasswordAfter(decodedToken.iat)) {
        return next(new AppError(403, "Password changed recently. Please login"));
    }
    request.user = user.dataValues;
    next();
};

exports.isAuthenticated = async (token) => {
    let user = null;
    // req.headers.authorization &&
    // req.headers.authorization.startsWith('Bearer')
    if (token && token.startsWith("Bearer")) {
        // token = req.headers.authorization.split(' ')[1];
        token = token.split(" ")[1];
        if (!token || token.length < 10) throw new ValidationError("Invalid token");

        // remove quotes if any
        token = token.replace(/^"(.*)"$/, "$1");
        // console.log(token);
        // verify token and extract data
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        // console.log(decoded)
        // check if user exists
        user = await User.findByPk(decoded.id);
        if (!user) {
            return false;
        }

        // check if user has changed password after the token was issued
        if (user.changedPasswordAfter(decoded.iat)) {
            return false;
        }
    }

    return true;
};

// Authorization --- check for permission
exports.restrictTo = (...roles) => {
    return (request, res, next) => {
        // roles = ['admin', 'lead-guide']
        // check if current user role is in roles[]
        if (!roles.includes(request.user.role)) {
            // unauthorized
            throw new ValidationError(
                "You do not have permission to perform this action",
                403
            );
        }

        // grant access
        next();
    };
};
