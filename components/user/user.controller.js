const jwt = require("jsonwebtoken");
const {
    models: { User },
} = require("../index");
const AppError = require("../../utils/app-error");
const catchAsyncError = require("../../utils/catch-async-err");
// const Profile = require("../profile/profile.model");

// const downloadUrl = backblaze();
// const Email = require("../utils/Email");

const signAndSendToken = (user, response) => {
    const { id, name, email, role } = user;

    const token = jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN, // validity of the token
    });

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // not modifiable by the browser
    };
    // users will be able to log in only in https connection in production
    if (process.env.NODE_ENV === "production") {
        // when in production cookie will be sent only on https connection
        cookieOptions.secure = true;
    }
    // send cookie
    response.cookie("token", token, cookieOptions);

    user.password = undefined; // when sending user data in response
    user.passwordChangedAt = undefined;
    user.passwordResetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    // const photo = user.photo;
    // user.refreshToken = refreshToken;
    // user.photo = `https://f000.backblazeb2.com/file/user-profile-pics/${photo}`;

    response.json({ data: { user, token } });
};

// create user account
exports.signup = catchAsyncError(async (request, response, next) => {
    const { name, email, password, confirmPassword } = request.body;
    // console.log(request.request.body);
    // never do: const newUser = await User.create(req.body)
    // check if user account already exists in the db
    if (!name || !email || !password || !confirmPassword) {
        return next(
            new AppError(400, "A name, email, password and confirmPassword are required.")
        );
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
        return next(
            new AppError(
                403,
                "An account with that email is already exist. You can login or reset password."
            )
        );
    }

    if (password !== confirmPassword) {
        return next(new AppError(400, "Password did not match"));
    }

    // load new user data into the db
    const newUser = await User.create({
        name,
        email,
        password,
    });

    // send token
    return signAndSendToken(newUser, response);
});

// Stage 1 Authentication --- Login --- check for identity
exports.login = catchAsyncError(async (request, response, next) => {
    const { email, password } = request.body;
    if (!email || !password) {
        return next(new AppError(400, "An email and password is required."));
    }

    // find user account in db
    const user = await User.findOne({ where: { email } });
    // console.log(user);
    // .select('+password')
    // check if user exists, if yes then check password if incorrect send error
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError(401, "Incorrect email or password"));
    }

    // if everything is ok then sign and send token to the client
    return signAndSendToken(user, response);
});

exports.logout = (request, response) => {
    response.cookie.set("token", "null", {
        expires: new Date(Date.now() + 1000), // 1second
        httpOnly: true,
    });
    response.statusCode = 200;
    response.json({
        message: "success",
    });
};
