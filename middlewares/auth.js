const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Auth
exports.auth = async (req, res, next) => {
    try {
        // extract Token 
        const token = req.cookies.body
            || req.body.token
            || req.header("Authorisation").replace("Bearer", "");

        // If token is missing, thne return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // verify the token
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is Invalid ",
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Some Thing went wrong while validating the token",
        })
    }
}
// isStudent

exports.isStudent = async (req, res, next) => {
    try {
        // const UserDetails = await User.findOne({});

        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is protected Route for student onlu",
            })
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified  , Please try again'
        })
    }
}

// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        // const UserDetails = await User.findOne({});

        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is protected Route for Instructor only",
            })
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified  , Please try again'
        })
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        // const UserDetails = await User.findOne({});

        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is protected Route for Admin only",
            })
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified  , Please try again'
        })
    }
}