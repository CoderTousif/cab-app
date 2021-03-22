module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((err) => next(err));
        // if there is error. err object is sent straight to the global errorController
    };
};
