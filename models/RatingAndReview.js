const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const SubSection = require("./SubSection");

const ratingAndReview = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("RatingAndReview", ratingAndReview);