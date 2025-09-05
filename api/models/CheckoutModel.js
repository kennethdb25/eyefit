const mongoose = require("mongoose");

const CheckOutSchema = new mongoose.Schema({
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

const CheckOutModel = new mongoose.model("CheckOutInfo", CheckOutSchema);

module.exports = CheckOutModel;
