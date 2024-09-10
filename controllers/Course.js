const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
// Course ko create
exports.createCourse = async (req, res) => {
    try {
        // Data fetching from the request body
        // get the id from user
        const userId = req.user.id;
        // fetch data
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
        } = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnail;

        // validation 
        if (!courseName || !courseDescription ||
            !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // checking for instructor
        // const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details :- ", instructorDetails);

        // Not getting data
        if (!instructorDetails) {
            return res.status(401).json({
                success: false,
                message: 'Instructor Details Not found',
            });
        }

        // checking if tag is valid
        const tagDetails = await Tag.findById({ Tag });
        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Tag',
            });
        }

        // upload to cloudinary 
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create course
        const newCourse = new Course({
            courseName,
            courseDescription,
            whatYouWillLearn: whatYouWillLearn,
            price,
            thumbnail: thumbnailImage.secure_url,
            tag: tagDetails._id,
            instructor: instructorDetails._id,
        });

        // add the new course to user schema of the instructor
        // const 
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true });

        // update the tag schema->
        //  TODO : HW
        return res.status(200).json({
            success: true,
            message: 'Course Created Successfully',
            data: newCourse,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Some error occurred while creating course',
            error: error.message,
        })
    }
}
// getAll Courses handler function
exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true
        })
            .populate("instructor")
            .exec();

        return res.status(200).json({
            success: true,
            message: 'Data for all  Courses fetched Successfully',
            data: allCourses,
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: false,
            message: "Cannot Fetch Courses data",
            error: error.message,
        })
    }
}