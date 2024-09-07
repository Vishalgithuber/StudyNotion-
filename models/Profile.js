const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    dateOfBirth: {
        type: String,
    },
    about: {
        type: String,
        trim: truem
    },
    contactNumber: {
        type: Number,
        trime: true,
    }
});

module.exports = mongoose.model("Profile", profileSchema);