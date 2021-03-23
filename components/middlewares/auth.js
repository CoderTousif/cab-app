const { promisify } = require("util"); // promisify() makes a synchronous function asynchronous
const jwt = require("jsonwebtoken");
// const crypto = require('crypto');
const AppError = require("../../utils/app-error");
const catchError = require("../../utils/catch-async-err");
const {
    models: { User },
} = require("../index");

// authentication --- Access to logged in user
exports.protect = catchError(async (request, _response, next) => {
    let token = request.headers.authorization || request.headers.cookie.token;

    if (!token || !token.startsWith("Bearer") || token.trim().length < 20) {
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
});
