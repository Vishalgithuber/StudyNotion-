const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        // check if the user already exists
        const checkUserPresent = await User.findOne({ email });
        // check if the user is present in the db
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already Registered'
            });
        }

        // Generate the otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialCharacters: false,
            numbers: true,
            lowerCaseAlphabets: false,
        });
        console.log("Otp Generated", otp);

        // check the uniqueness of the otp
        let result = await OTP.findOne({ otp: otp });

        while (result) {
            // if your getting result
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialCharacters: false,
                numbers: true,
                lowerCaseAlphabets: false,
            });
            let result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        // save otp to db
        const otpbody = await OTP.create(otpPayload);

        // return response successfully
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp,
        })
    } catch (error) {
        console.log("error:-", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
// H.W --> email validation

// Signup

exports.signup = async (req, res) => {
    // How to perform signup function
    // data fetch from req body
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accoutnType,
            constactNumber,
            otp
        } = req.body;
        // Then chekcing validatu of the data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // 2 password matching create and confirm pwd
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match with confirmPassword',
            });
        }
        // check the user already is in db or not
        const exisitingUser = await User.findOne({ email });

        if (exisitingUser) {
            return res.status(400).json({
                success: false,
                message: 'User is already registered',
            });
        }

        // if all right then find the most recent OTP stored for the user
        const recentOtp = await User.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        // then validate the otp 
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: 'OTP found',
            });
        }
        else if (otp !== recentOtp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);


        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // entry create in db
        const user = await User.create({
            firstName,
            lastName,
            email,
            constactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            images: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}`
        })

        // return res
        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'User cannot be registered . Please Try Again!!',
        })
    }
}
// login

exports.login = async (req, res) => {
    // Logic for login
    // Fetching data from request body
    try {
        const { email, password } = req.body;
        // Check if the email is provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // Check if user exists in db
        const user = await User.findOne({ email }).populate("additional Details");
        // If user is not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User is Not registered , please signup first',
            });
        }
        // check for password
        // const match = await bcrypt.compare
        if (!await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                tokem,
                user,
                message: "Logged Successfully",
            })
        }

        else {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login Failure , please try again',
        })
    }
}
// changepassword
