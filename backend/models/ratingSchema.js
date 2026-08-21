import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    review: {
        type: String
    }

}, {
    timestamps: true
});

export const Rating = mongoose.model("Rating",ratingSchema)