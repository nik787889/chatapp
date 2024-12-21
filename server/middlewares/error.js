import { envMode } from "../app.js";

// //
// const errorMiddleware = (err, req, res, next) => {

//     // err.message = err.message || "Internal Server Error";  " or "
//     err.message ||= "Internal Server Error";
//     // err.statusCode = err.statusCode || 500; " or "
//     err.statusCode ||= 500;

//     if (err.code === 11000) {
//         const error = Object.keys(err.keyPattern).join(",")
//         err.message = `Duplicate field : ${error}`
//         err.statusCode = 400
//     }

//     if (err.name === "CastError") {
//         const errorPath = err.path
//         err.message = `Invalid Formate of Path : ${errorPath}`
//         err.statusCode = 400
//     }

//     return res.status(err.statusCode).json({
//         success: false,
//         message: envMode === "DEVELOPMENT" ? err : err.message,
//     })
// }

const errorMiddleware = (err, req, res, next) => {
    // Ensure message and statusCode are defined
    err.message ||= "Internal Server Error"; // Default message for generic errors
    err.statusCode ||= 500; // Default status code for server errors

    // MongoDB Duplicate Key Error Handling (11000)
    if (err.code === 11000) {
        const error = Object.keys(err.keyPattern).join(",");
        err.message = `Duplicate field value entered: ${error}`;  // Provide more context
        err.statusCode = 400;  // Client error for bad request
    }

    // Mongoose CastError Handling (e.g., invalid ID format)
    if (err.name === "CastError") {
        const errorPath = err.path;
        err.message = `Invalid format for path: ${errorPath}`;
        err.statusCode = 400;
    }

    // Mongoose Validation Error Handling (if any)
    if (err.name === "ValidationError") {
        const errorMessages = Object.values(err.errors).map(val => val.message);
        err.message = `Validation error: ${errorMessages.join(", ")}`;
        err.statusCode = 400;
    }

    // Return the error response, with detailed error in development mode
    return res.status(err.statusCode).json({
        success: false,
        message: process.env.NODE_ENV === "development" ? err : err.message,  // Show full error in development
    });
};


const TryCatch = (passedFunc) => async (req, res, next) => {
    try {
        await passedFunc(req, res, next)
    } catch (error) {
        next(error)
    }
}

export { errorMiddleware, TryCatch }
