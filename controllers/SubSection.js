const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
// create a new SubSection
exports.createSubSection = async (req, res) => {
    try {
        // fetch data
        const { sectionId, timeDuration, description, title, } = req.body;
        // extract the file or video
        const video = req.files.videoFile;
        // validation
        if (!sectionId || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        // upload video to cloudinary 
        const uploadDetails = await uploadImageToCloudinary(video, process_params.env.FOLDER_NAME);
        // create a new subsection
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,

        });
        // update the section one with subsection ObjectId
        const updateSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: { subsections: SubSectionDetails._id }
            },
            { new: true }).populate("subSection");

        // return response
        return res.status(200).json({
            succcess: false,
            message: 'Subsection created successfully',
            updateSection
        })


    } catch (error) {
        // console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Some error occurred while creating subsection',
            error: error.message
        })
    }
}
// Update SubSection
exports.updateSubSection = async (req, res) => {
    try {
        const { subSectionId, title, timeDuration, description } = req.body;

        // Validation
        if (!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Find the subsection and update it
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            { title, timeDuration, description },
            { new: true }
        );

        // Return response
        return res.status(200).json({
            success: true,
            message: 'Subsection updated successfully',
            updatedSubSection,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to update subsection, please try again',
            error: error.message,
        });
    }
};

// Delete SubSection
exports.deleteSubSection = async (req, res) => {
    try {
        // Fetch subsection ID from params
        const { subSectionId } = req.params;

        // Find and delete the subsection
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        // Check if the subsection was found and deleted
        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: 'Subsection not found',
            });
        }

        // Update the section by pulling the deleted subsection's ID
        const updatedSection = await Section.findByIdAndUpdate(
            deletedSubSection.sectionId, // Assuming there's a sectionId field in SubSection
            {
                $pull: { subsections: subSectionId },
            },
            { new: true }
        ).populate('subsections'); // Populate to get updated subsections

        // Return response
        return res.status(200).json({
            success: true,
            message: 'Subsection deleted successfully',
            updatedSection,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to delete subsection, please try again',
            error: error.message,
        });
    }
};


