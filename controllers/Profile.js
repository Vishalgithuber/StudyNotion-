const Profile = require("../models/Profile");
const User = require("../models/User");
exports.createProfile = async (req, res) => {
    try {
        // How to update the profile
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
        // Data fetch
        const userId = req.user.id;
        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        };
        // check if user exist
        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        // update the profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Profile updated unsuccessfully",
            message: error.message
        });
    }
}

// delete profile 
exports.deleteProfile = async (req, res) => {
    try {
        // Get id
        const id = req.user.id;
        // check if profileId is provided
        // check if user exist or  // validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        // delete Profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
        // TODO : HW unenroll user form all enrolled course
        // delete User
        await User.findByIdAndDelete({ _id: id });
        return res.status(200).json({
            success: true,
            message: "Profile and User deleted successfully"
        });

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "User cannot be deleted successfully",
        });
    }

}

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();
        console.log(userDetails);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}