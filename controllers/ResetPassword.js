const User = require("../models ");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// ResetPasswordToken :- 
exports.resetPasswordToken = async (req, res) => {
    try {
        // got mail from req.body
        const { email } = req.body;
        // check user for this mail , email validation
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'Your email is not registered with us'
            });
        }
        // Token generate
        const token = crypto.randomUUID();
        // update the user by adding token and expiration time

        const updateDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000 // 1 hour
            },
            { new: true });
        // create url
        const url = `https://localhost:3000/update-password/${token}`;
        // send mail containing the url 
        await mailSender(email,
            "Password Reseet Link",
            `Password Reset Link: ${url}`);

        return res.json({
            success: true,
            message: "Email Sent Successfully , Please change the password",
        })
        // return response
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'SomeThing went wrong while reset password ',

        });
    }
}
// reset password:- 
exports.resetPassword = async (req, res) => {
    try {
        //data fetch
        const { password, confirmPassword, token } = req.body;
        // validation
        if (!password || !confirmPassword || !token) {
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
        const userDetails = await User.findOne({ token: token });
        if (!userDetails) {
            return res.json({
                success: false,
                message: 'Invalid Token or Token expired',
            });
        }
        // Token time check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: 'Token expired , please generate The new Token',
            });
        }
        // Hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        // update the password 
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true },
        );

        // return response;
        return res.status(200).json({
            success: true,
            message: "password reset successful"
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'SomeThing went wrong while reset password ',
        })

    }
}