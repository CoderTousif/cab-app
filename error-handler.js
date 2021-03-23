module.exports = (err, _req, res) => {
    console.log(err.name);
    if (err.statusCode < 500) {
        res.status(err.statusCode).json({
            ok: false,
            error: { statusCode: err.statusCode, message: err.message },
            stack: err.stack,
        });
    } else {
        let statusCode = err.statusCode || 500;
        let message = "Something went wrong";
        if (err?.errors && err?.errors[0]?.message) {
            statusCode = 400;
            message = err?.errors[0]?.message;
        }

        console.log(err);
        res.status(statusCode).json({
            ok: false,
            error: { statusCode: statusCode, message },
        });
    }
};
