const mongoose = require("mongoose");

const ViewSchema = new mongoose.Schema({
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

const ViewModel = new mongoose.model("ViewInfo", ViewSchema);

module.exports = ViewModel;
