// //
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import { USER_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";


const isAuthenticated = TryCatch(async (req, res, next) => {

    const token = req.cookies[USER_TOKEN]

    if (!token) return next(new ErrorHandler("Please login to access this route", 401))

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decodedData._id

    next()

})


const isAdmin = TryCatch(async (req, res, next) => {

    const token = req.cookies["admin-token"]
    if (!token) return next(new ErrorHandler("Only Admin can access this route", 401))

    const adminID = jwt.verify(token, process.env.JWT_SECRET)
    const adminSecretKey = process.env.ADMIN_SECRET_KEY || "299792458m/S"

    const isMetched = adminID === adminSecretKey
    if (!isMetched) return next(new ErrorHandler("Only Admin can access this route", 401))

    next()

})


const socketAuthentication = async (err, socket, next) => {
    try {
        if (err) return next(err)

        const authToken = socket.request.cookies[USER_TOKEN]
        if (!authToken) return next(new ErrorHandler("Please login to acess this route", 401))

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET)

        const user = await User.findById(decodedData._id)
        if (!user) return next(new ErrorHandler("Please login to acess this route", 401))

        socket.user = user

        return next()
        
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Please login to acess this route", 401))
    }
}


export { isAuthenticated, isAdmin, socketAuthentication }

