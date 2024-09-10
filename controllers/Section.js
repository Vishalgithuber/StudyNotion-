const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');
require("dotenv").config();
// Create Section
exports.createSection = async (req, res) => {
    try {
        const { courseId, sectionName } = req.body;

        // Data validation
        if (!courseId || !sectionName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Create a new section
        const newSection = await Section.create({ sectionName });

        // Push the new section into the course
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { new: true }
        )
        .populate({
            path: 'courseContent',
            populate: {
                path: 'subSections', // Assuming each section has subsections
            },
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Section created successfully',
            updatedCourseDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to create section, please try again',
            error: error.message,
        });
    }
};

// Update Section
exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body;

        // Data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Find the section and update it
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            updatedSection,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to update section, please try again',
            error: error.message,
        });
    }
};

// Delete Section
exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params;

        // Find and delete the section
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        // Update the course content after section deletion
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            deletedSection.courseId,
            {
                $pull: { courseContent: sectionId },
            },
            { new: true }
        )
        .populate({
            path: 'courseContent',
            populate: {
                path: 'subSections',
            },
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Section deleted successfully',
            updatedCourseDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to delete section, please try again',
            error: error.message,
        });
    }
};
