module.exports = (err, _req, res, _next) => {
    console.log(err.name);
    if (err.statusCode < 500) {
        res.status(err.statusCode).json({
            ok: false,
            error: { statusCode: err.statusCode, message: err.message },
            stack: err.stack,
        });
    } else {
        let statusCode = err.statusCode || 500;

        console.log(err);
        res.status(statusCode).json({
            ok: false,
            error: err?.errors || err.message,
        });
    }
};
