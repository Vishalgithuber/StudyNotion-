const Tag = require("../models/Tag");

// create tag ka handler function
exports.createTag = async (req, res) => {
    try {
        // How to do create tag
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        // create entry in DB
        const tagDetails = await Tag({
            name: name,
            description: description,
        });
        console.log(tagDetails);
        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

// Second handler function all get tags
exports.showAlltags = async (req, res) => {
    try {
        // How to get all tags
        const allTags = await Tag.find({}, { name: true, description: true });
        console.log(allTags);
        return res.status(200).json({
            success: true,
            message: "All tags are return successfully",
            allTags: allTags
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Third handler function for get single tag

