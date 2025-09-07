const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductInfo",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const LikeModel = new mongoose.model("LikeInfo", LikeSchema);

module.exports = LikeModel;
