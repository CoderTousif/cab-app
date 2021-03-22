class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        // operational errors are known or trusted errors that are marked as errors by us
        this.isOperational = true;
        // error stack
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
